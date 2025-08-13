import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  registerSchema,
  type RegisterValues,
  signUp,
} from '@/services/auth/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface UserFormProps extends React.ComponentProps<'form'> {
  onClose: () => void;
  show: boolean;
}

export default function UserForm({
  className,
  onClose,
  show,
  ...props
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: RegisterValues) => signUp(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || 'Login gagal'
      );
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    console.log(data);

    await mutateAsync(data);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex justify-center items-center text-accent-foreground transition-opacity duration-300 ${
        show
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none hidden'
      }`}
    >
      <div className='flex flex-col bg-white m-5 w-full h-fit max-w-[400px] rounded-sm p-5'>
        <div className='flex justify-end'>
          <button type='button' onClick={onClose}>
            <X className='text-gray-500' />
          </button>
        </div>
        <div className='mt-[10px]'>
          <p className='text-2xl font-medium'>Add User</p>
          <p className='text-gray-400'>Assign user a role</p>
        </div>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn('flex flex-col gap-6', className)}
            {...props}
          >
            <div className='grid gap-3 mt-5'>
              <div className='grid gap-3'>
                <Label htmlFor='name'>
                  Nama <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  type='name'
                  placeholder='John Doe'
                  {...register('name')}
                />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name.message}</p>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='email'>
                  Email <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>
                    Password <span className='text-red-500'>*</span>
                  </Label>
                </div>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-red-500 text-sm'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='role'>
                  Role <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Role</SelectLabel>
                          <SelectItem value='admin'>Admin</SelectItem>
                          <SelectItem value='superadmin'>
                            Super Admin
                          </SelectItem>
                          <SelectItem value='maintenance'>
                            Maintenance
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className='text-red-500 text-sm'>{errors.role.message}</p>
                )}
              </div>
              <div className='flex justify-end mt-3'>
                <Button variant={'asa'} type='submit' className='w-fit' disabled={isPending}>
                  {isPending ? 'Adding User...' : 'Add User'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
