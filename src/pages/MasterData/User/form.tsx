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
  getUserById,
  registerSchema,
  type RegisterValues,
  signUp,
  updateUsers,
} from '@/services/auth/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Eye, EyeOff, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

interface UserFormProps extends React.ComponentProps<'form'> {
  onClose: () => void;
  show: boolean;
  userId?: string;
}

export default function UserForm({
  className,
  onClose,
  show,
  userId,
  ...props
}: UserFormProps) {
  const schema = userId
    ? registerSchema.extend({
        password: z.string().optional(),
      })
    : registerSchema.extend({
        password: z.string().min(6, 'Password minimal 6 karakter'),
      });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: undefined,
    },
  });

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);

  const {
    data: userData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId && show,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: RegisterValues) =>
      userId === undefined ? signUp(data) : updateUsers(data, userId),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/user')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Gagal menambah user'
      );
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    console.log(data);

    if (userId && !data.password) {
      const { password, ...rest } = data;
      await mutateAsync(rest as RegisterValues);
    } else {
      await mutateAsync(data);
    }
  };

  useEffect(() => {
    if (userData?.data) {
      reset({
        name: userData.data.name,
        email: userData.data.email,
        password: '',
        role: userData.data.role as 'admin' | 'superadmin' | 'maintenance',
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    if (show && !!userId) {
      refetch();
    }
  }, [show, userId, refetch]);

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
          <p className='text-2xl font-medium'>
            {userId ? 'Edit User' : 'Add User'}
          </p>
          <p className='text-gray-400'>
            {userId ? 'Edit user info' : 'Assign user a role'}
          </p>
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
                  placeholder={userId ? '' : 'John Doe'}
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
                  placeholder={userId ? '' : 'm@example.com'}
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>
                    {userId ? 'New Password (optional)' : 'Password'}{' '}
                    <span className='text-red-500'>*</span>
                  </Label>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-3 flex items-center'
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className='text-gray-500' size={18} />
                    ) : (
                      <Eye size={18} className='text-gray-500' />
                    )}
                  </button>
                </div>

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
                  defaultValue={undefined}
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
                <Button
                  variant={'asa'}
                  type='submit'
                  className='w-fit'
                  disabled={isPending || isFetching}
                >
                  {isFetching
                    ? 'Loading...'
                    : userId
                    ? isPending
                      ? 'Updating'
                      : 'Update User'
                    : isPending
                    ? 'Adding User...'
                    : 'Add User'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
