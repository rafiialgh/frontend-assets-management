import { MultiSelectCategories } from '@/components/multi-select-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  locationSchema,
  type LocationValues,
} from '@/services/location/location.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface UserFormProps extends React.ComponentProps<'form'> {
  onClose: () => void;
  show: boolean;
}

export default function LocationForm({
  className,
  onClose,
  show,
  ...props
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocationValues>({
    resolver: zodResolver(locationSchema),
  });

  const onSubmit = (data: LocationValues) => {
    console.log(data);
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
          <p className='text-2xl font-medium'>Add Lokasi</p>
          <p className='text-gray-400'>Create a new asset storage place</p>
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
                  Lokasi <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  type='name'
                  placeholder='e.g Gudang 1'
                  {...register('lokasi')}
                />
                {errors.lokasi && (
                  <p className='text-red-500 text-sm'>
                    {errors.lokasi.message}
                  </p>
                )}
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='role'>
                  Kategori Aset <span className='text-red-500'>*</span>
                </Label>
                <MultiSelectCategories
                  selectedCategories={watch('kategori') || []}
                  onCategoriesChange={(vals) => setValue('kategori', vals)}
                  placeholder='e.g Kategori 1, Kategori 2'
                />
                {errors.kategori && (
                  <p className='text-red-500 text-sm'>
                    {errors.kategori.message}
                  </p>
                )}
              </div>
              <div className='flex justify-end mt-3'>
                <Button variant={'asa'} type='submit' className='w-fit'>
                  Add Lokasi
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
