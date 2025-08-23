import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  addUserSchema,
  editUserSchema,
  getUserById,
  type RegisterValues,
  signUp,
  updateUsers,
  type UpdateUserValues,
} from '@/services/auth/auth.service';
import { getDropdown } from '@/services/global/global.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
  const isEdit = Boolean(userId);
  const schema = isEdit ? editUserSchema : addUserSchema;

  type FormValues = RegisterValues | UpdateUserValues;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: undefined,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId && show,
    // refetchOnWindowFocus: false,
    // staleTime: 0,
  });

  console.log(userData);

  const { data: dropdown, isLoading: isLoadingDropdown } = useQuery({
    queryKey: ['dropdown'],
    queryFn: () => getDropdown(),
  });

  console.log(dropdown);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormValues) => {
      if (isEdit) {
        return updateUsers(data as UpdateUserValues, userId!);
      }
      return signUp(data as RegisterValues);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Gagal memproses user'
      );
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = { ...data };

    if (payload.role) {
      payload.role = normalizeRole(payload.role);
    }

    if (isEdit && (!payload.password || payload.password.trim() === '')) {
      delete payload.password;
    }

    await mutateAsync(payload);
  };

  const normalizeRole = (role: string) => {
    return role.toLowerCase().replace(/\s+/g, '');
  };

  useEffect(() => {
    if (show) {
      if (isEdit && userData?.data) {
        reset({
          name: userData.data.name,
          email: userData.data.email,
          role: userData.data.role.userRoleId,
          password: '',
        });
      } else if (!isEdit) {
        reset({
          name: '',
          email: '',
          role: undefined,
          password: '',
        });
      }
    }
  }, [show, isEdit, userData, reset]);

  if (
    !show ||
    (isEdit && (isLoadingUserData || !userData?.data || isLoadingDropdown))
  ) {
    return null;
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {/* {category === "Physical" ? <Package className="h-5 w-5" /> : <HardDrive className="h-5 w-5" />} */}
            {userId ? 'Edit User' : 'Add User'}
          </DialogTitle>
          <DialogDescription>
            {userId ? 'Edit user info' : 'Assign user a role'}
          </DialogDescription>
        </DialogHeader>
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
                          {dropdown?.data.userRole.map((role) => (
                            <SelectItem
                              key={role.userRoleId}
                              value={role.userRoleId}
                            >
                              {role.nameRole}
                            </SelectItem>
                          ))}
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
                  disabled={isPending || isLoadingUserData}
                >
                  {isLoadingUserData
                    ? 'Loading...'
                    : userId
                    ? isPending
                      ? 'Updating...'
                      : 'Update User'
                    : isPending
                    ? 'Adding User...'
                    : 'Add User'}
                </Button>
              </div>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
}
