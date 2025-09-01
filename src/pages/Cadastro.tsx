import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'

const Schema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Mínimo de 8 caracteres'),
  confirmarSenha: z.string().min(8, 'Mínimo de 8 caracteres'),
  codigoSufixo: z.string().min(4, 'Ex.: AFD0D7'),
  telefone: z.string().optional(),
  genero: z.string().optional(),
  dataNascimento: z.string().optional(),
}).refine(d => d.senha === d.confirmarSenha, {
  path: ['confirmarSenha'],
  message: 'Senhas não conferem'
})

type FormData = z.infer<typeof Schema>

export default function Cadastro() {
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, setError, reset, setValue, watch } =
    useForm<FormData>({ resolver: zodResolver(Schema), mode: 'onChange' })

  const watchGenero = watch('genero')

  async function onSubmit(values: FormData) {
    setSubmitting(true)
    setFormError(null)
    
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(values),
      })
      
      const body = await res.json().catch(() => ({}))
      
      if (!res.ok) {
        if (body?.field && body?.message) {
          setError(body.field as any, { message: body.message })
        } else {
          setFormError(body?.message || 'Erro ao cadastrar')
        }
        return
      }
      
      setSuccess(true)
      reset()
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch {
      setFormError('Falha de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Cadastro realizado!</CardTitle>
            <CardDescription>
              Sua conta foi criada com sucesso. Redirecionando para o login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para se cadastrar
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {formError && (
              <div className="rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input 
                id="nome"
                placeholder="Seu nome completo" 
                {...register('nome')}
                className={errors.nome ? 'border-destructive' : ''}
              />
              {errors.nome && (
                <p className="text-xs text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email"
                type="email"
                placeholder="voce@email.com" 
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input 
                  id="senha"
                  type="password" 
                  placeholder="••••••••" 
                  {...register('senha')}
                  className={errors.senha ? 'border-destructive' : ''}
                />
                {errors.senha && (
                  <p className="text-xs text-destructive">{errors.senha.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <Input 
                  id="confirmarSenha"
                  type="password" 
                  placeholder="Repita a senha" 
                  {...register('confirmarSenha')}
                  className={errors.confirmarSenha ? 'border-destructive' : ''}
                />
                {errors.confirmarSenha && (
                  <p className="text-xs text-destructive">{errors.confirmarSenha.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigoSufixo">Código de convite (apenas sufixo)</Label>
              <Input 
                id="codigoSufixo"
                placeholder="AFD0D7" 
                {...register('codigoSufixo')}
                className={errors.codigoSufixo ? 'border-destructive' : ''}
              />
              {errors.codigoSufixo && (
                <p className="text-xs text-destructive">{errors.codigoSufixo.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Vamos completar com "BJJ-" automaticamente.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone (opcional)</Label>
                <Input 
                  id="telefone"
                  placeholder="(xx) xxxxx-xxxx" 
                  {...register('telefone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Gênero (opcional)</Label>
                <Select 
                  value={watchGenero || ''} 
                  onValueChange={(value) => setValue('genero', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de nascimento (opcional)</Label>
              <Input 
                id="dataNascimento"
                type="date" 
                {...register('dataNascimento')}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Cadastrando...' : 'Criar conta'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}