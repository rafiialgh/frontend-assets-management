import { GalleryVerticalEnd } from 'lucide-react';
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { cn } from '@/lib/utils';
import AuthLayout from '@/components/authLayout';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginValues } from '@/services/auth/auth.service';
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: LoginValues) => {
    console.log("Login data:", data);
    // TODO: panggil API login
  };


  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col gap-6', className)} {...props}>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Login to your account</h1>
          <p className='text-muted-foreground text-sm text-balance'>
            Enter your email below to login to your account
          </p>
        </div>
        <div className='grid gap-6'>
          <div className='grid gap-3'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className='grid gap-3'>
            <div className='flex items-center'>
              <Label htmlFor='password'>Password</Label>
              <a
                href='#'
                className='ml-auto text-sm underline-offset-4 hover:underline'
              >
                Forgot your password?
              </a>
            </div>
            <Input id='password' type='password' {...register('password')} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </div>
        <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link to='/register' className='underline underline-offset-4'>
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
