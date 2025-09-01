import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface CadastroRequest {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  codigoSufixo: string
  telefone?: string
  genero?: string
  dataNascimento?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const body: CadastroRequest = await req.json()
    
    // Validação básica
    if (!body.nome || body.nome.length < 3) {
      return new Response(
        JSON.stringify({ field: 'nome', message: 'Informe seu nome completo' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!body.email || !body.email.includes('@')) {
      return new Response(
        JSON.stringify({ field: 'email', message: 'E-mail inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!body.senha || body.senha.length < 8) {
      return new Response(
        JSON.stringify({ field: 'senha', message: 'Mínimo de 8 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (body.senha !== body.confirmarSenha) {
      return new Response(
        JSON.stringify({ field: 'confirmarSenha', message: 'Senhas não conferem' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!body.codigoSufixo || body.codigoSufixo.length < 4) {
      return new Response(
        JSON.stringify({ field: 'codigoSufixo', message: 'Informe o sufixo do convite' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const codigo_convite = `BJJ-${body.codigoSufixo.trim().toUpperCase()}`
    const emailNorm = body.email.trim().toLowerCase()

    // 1) Verificar academia pelo código
    const { data: academia, error: errAcad } = await supabase
      .from('academias')
      .select('id, codigo_convite')
      .eq('codigo_convite', codigo_convite)
      .maybeSingle()

    if (errAcad) {
      console.error('Erro ao validar academia:', errAcad)
      return new Response(
        JSON.stringify({ message: 'Erro ao validar academia' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!academia) {
      return new Response(
        JSON.stringify({ field: 'codigoSufixo', message: 'Código de convite inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2) Verificar e-mail duplicado
    const { data: jaExiste, error: errEmail } = await supabase
      .from('usuarios')
      .select('id')
      .ilike('email', emailNorm)
      .maybeSingle()

    if (errEmail) {
      console.error('Erro ao validar e-mail:', errEmail)
      return new Response(
        JSON.stringify({ message: 'Erro ao validar e-mail' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (jaExiste) {
      return new Response(
        JSON.stringify({ field: 'email', message: 'E-mail já cadastrado' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3) Hash da senha usando a Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(body.senha)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const senhaHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // 4) Criar usuário
    const usuarioPayload = {
      nome: body.nome,
      email: emailNorm,
      senha: senhaHash,
      telefone: body.telefone || null,
      genero: body.genero || null,
      data_nascimento: body.dataNascimento || null,
      ativo: true,
    }

    const { data: novoUsuario, error: errUser } = await supabase
      .from('usuarios')
      .insert(usuarioPayload)
      .select('id')
      .single()

    if (errUser || !novoUsuario?.id) {
      console.error('Erro ao criar usuário:', errUser)
      return new Response(
        JSON.stringify({ message: 'Erro ao criar usuário' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const usuarioId = novoUsuario.id

    try {
      // 5) Criar papel de aluno
      const { error: errRole } = await supabase
        .from('usuarios_papeis')
        .insert({ 
          usuario_id: usuarioId, 
          papel_id: 6 // ID do papel Aluno conforme o banco
        })
      
      if (errRole) {
        throw new Error('Erro ao criar papel')
      }

      // 6) Buscar próximo número de matrícula
      const { data: lastMat, error: errLast } = await supabase
        .from('matriculas')
        .select('numero')
        .eq('academia_id', academia.id)
        .order('numero', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (errLast) {
        throw new Error('Erro ao buscar número de matrícula')
      }

      const proximoNumero = (lastMat?.numero ?? 0) + 1

      // 7) Criar matrícula
      const { error: errMat } = await supabase
        .from('matriculas')
        .insert({
          aluno_id: usuarioId,
          academia_id: academia.id,
          numero: proximoNumero
        })

      if (errMat) {
        throw new Error('Erro ao criar matrícula')
      }

      // Sucesso
      return new Response(
        JSON.stringify({ 
          usuario_id: usuarioId, 
          academia_id: academia.id, 
          numero_matricula: proximoNumero 
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (e) {
      // Rollback - deletar usuário criado
      await supabase.from('usuarios').delete().eq('id', usuarioId)
      
      return new Response(
        JSON.stringify({ message: 'Erro ao concluir cadastro' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Erro geral:', error)
    return new Response(
      JSON.stringify({ message: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})