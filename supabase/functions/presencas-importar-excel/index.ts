import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as XLSX from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📊 Starting presencas-importar-excel function');

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const aulaInstanciaId = formData.get('aula_instancia_id') as string;

    if (!file || !aulaInstanciaId) {
      return new Response(
        JSON.stringify({ error: 'File e aula_instancia_id são obrigatórios' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get current user ID from auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autenticação necessário' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user ID from usuarios table
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (usuarioError || !usuario) {
      console.error('❌ Error getting user:', usuarioError);
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const registradoPor = usuario.id;

    console.log(`📁 Processing Excel file: ${file.name}`);

    // Read Excel file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📋 Found ${jsonData.length} rows in Excel`);

    if (jsonData.length < 2) { // At least header + 1 data row
      return new Response(
        JSON.stringify({ error: 'Arquivo Excel deve conter pelo menos uma linha de dados' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Skip header row and process data
    const dataRows = jsonData.slice(1) as any[][];
    const presencasData = [];
    const errors = [];

    // Get all students to validate aluno_id or find by name
    const { data: todosUsuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nome, email');

    if (usuariosError) {
      console.error('❌ Error getting usuarios:', usuariosError);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar usuários' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // +2 because we skipped header and arrays are 0-indexed
      
      if (!row || row.length === 0) continue;
      
      const [alunoIdOrName, status, observacao] = row;
      
      if (!alunoIdOrName || !status) {
        errors.push(`Linha ${rowNumber}: aluno_id/nome e status são obrigatórios`);
        continue;
      }

      // Validate status
      const validStatuses = ['presente', 'ausente', 'justificado'];
      const statusLower = status.toString().toLowerCase();
      if (!validStatuses.includes(statusLower)) {
        errors.push(`Linha ${rowNumber}: status deve ser presente, ausente ou justificado`);
        continue;
      }

      // Find student by ID or name
      let aluno_id = null;
      
      // Try to find by ID first (if it looks like a UUID)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(alunoIdOrName);
      
      if (isUuid) {
        const usuario = todosUsuarios?.find(u => u.id === alunoIdOrName);
        if (usuario) {
          aluno_id = usuario.id;
        }
      } else {
        // Try to find by name (case insensitive)
        const usuario = todosUsuarios?.find(u => 
          u.nome.toLowerCase().includes(alunoIdOrName.toString().toLowerCase())
        );
        if (usuario) {
          aluno_id = usuario.id;
        }
      }

      if (!aluno_id) {
        errors.push(`Linha ${rowNumber}: aluno não encontrado: ${alunoIdOrName}`);
        continue;
      }

      presencasData.push({
        aluno_id,
        aula_instancia_id: aulaInstanciaId,
        status: statusLower,
        observacao: observacao ? observacao.toString() : null,
        registrada_por: registradoPor,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    console.log(`📝 Processed ${presencasData.length} valid presencas, ${errors.length} errors`);

    if (presencasData.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Nenhuma presença válida encontrada', 
          details: errors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Delete existing presencas for this aula_instancia_id to avoid duplicates
    const { error: deleteError } = await supabase
      .from('presencas')
      .delete()
      .eq('aula_instancia_id', aulaInstanciaId);

    if (deleteError) {
      console.error('❌ Error deleting existing presencas:', deleteError);
    } else {
      console.log('🗑️ Deleted existing presencas');
    }

    // Insert new presencas
    const { data: insertedPresencas, error: insertError } = await supabase
      .from('presencas')
      .insert(presencasData)
      .select();

    if (insertError) {
      console.error('❌ Error inserting presencas:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao salvar presenças importadas', 
          details: insertError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`✅ Successfully imported ${insertedPresencas?.length || 0} presencas`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${insertedPresencas?.length || 0} presenças importadas com sucesso`,
        imported: insertedPresencas?.length || 0,
        errors: errors.length > 0 ? errors : undefined,
        data: insertedPresencas 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error in presencas-importar-excel:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});