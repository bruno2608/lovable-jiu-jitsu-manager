import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'

const Schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
})

type FormData = z.infer<typeof Schema>

export default function Login() {
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(Schema), mode: 'onChange' })

  async function onSubmit(values: FormData) {
    setSubmitting(true)
    setFormError(null)
    
    try {
      // TODO: Implementar autenticação real
      console.log('Login attempt:', values)
      
      // Simulação de login por enquanto
      setTimeout(() => {
        navigate('/')
      }, 1000)
      
    } catch {
      setFormError('Falha de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Digite suas credenciais para acessar o sistema
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
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
            
            <div className="text-sm text-center text-muted-foreground">
              Não tem conta?{' '}
              <Link to="/cadastro" className="text-primary hover:underline">
                Cadastre-se aqui
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}