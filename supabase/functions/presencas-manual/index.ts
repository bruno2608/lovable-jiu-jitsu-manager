import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

interface SavePresencasRequest {
  aula_instancia_id: string;
  presencas: Array<{
    aluno_id: string;
    status: string;
    observacao?: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎯 Starting presencas-manual function');

    const { aula_instancia_id, presencas }: SavePresencasRequest = await req.json();

    if (!aula_instancia_id || !presencas || presencas.length === 0) {
      return new Response(
        JSON.stringify({ error: 'aula_instancia_id e presencas são obrigatórios' }),
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

    console.log(`📝 Processing ${presencas.length} presencas for aula_instancia_id: ${aula_instancia_id}`);

    // Delete existing presencas for this aula_instancia_id to avoid duplicates
    const { error: deleteError } = await supabase
      .from('presencas')
      .delete()
      .eq('aula_instancia_id', aula_instancia_id);

    if (deleteError) {
      console.error('❌ Error deleting existing presencas:', deleteError);
    } else {
      console.log('🗑️ Deleted existing presencas');
    }

    // Prepare presencas data for insertion
    const presencasData = presencas.map(presenca => ({
      aluno_id: presenca.aluno_id,
      aula_instancia_id: aula_instancia_id,
      status: presenca.status,
      observacao: presenca.observacao || null,
      registrada_por: registradoPor,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert new presencas
    const { data: insertedPresencas, error: insertError } = await supabase
      .from('presencas')
      .insert(presencasData)
      .select();

    if (insertError) {
      console.error('❌ Error inserting presencas:', insertError);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar presenças', details: insertError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`✅ Successfully saved ${insertedPresencas?.length || 0} presencas`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${insertedPresencas?.length || 0} presenças salvas com sucesso`,
        data: insertedPresencas 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error in presencas-manual:', error);
    
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