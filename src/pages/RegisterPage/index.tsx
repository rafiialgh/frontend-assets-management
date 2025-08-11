import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { cn } from '@/lib/utils';
import AuthLayout from '@/components/authLayout';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterValues } from '@/services/auth/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';

export default function RegisterPage({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = (data: RegisterValues) => {
      console.log("Register data:", data);
      // TODO: panggil API register
    };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col gap-6', className)} {...props}>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Create an account</h1>
          <p className='text-muted-foreground text-sm text-balance'>
            Enter your email to register
          </p>
        </div>
        <div className='grid gap-6'>
          <div className='grid gap-3'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              type='text'
              placeholder='John Doe'
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
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
            Register
          </Button>
        </div>
        <div className='text-center text-sm'>
          Already have an account?{' '}
          <a href='/login' className='underline underline-offset-4'>
            Sign In
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}
