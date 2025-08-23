import { MultiSelectCategories } from '@/components/multi-select-categories';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getDropdown } from '@/services/global/global.service';
import {
  createLocation,
  getLocationById,
  locationSchema,
  updateLocation,
  type LocationValues,
} from '@/services/location/location.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UserFormProps extends React.ComponentProps<'form'> {
  onClose: () => void;
  show: boolean;
  locationId?: string;
}

export default function LocationForm({
  className,
  onClose,
  show,
  locationId,
  ...props
}: UserFormProps) {
  const isEdit = Boolean(locationId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LocationValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      lokasi: '',
      kategori: [],
    },
  });

  const { data: locationData, isLoading } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => getLocationById(locationId!),
    enabled: !!locationId && show,
  });

  console.log(locationData);

  const { data: dropdown, isLoading: isLoadingDropdown } = useQuery({
    queryKey: ['dropdown'],
    queryFn: () => getDropdown(),
    enabled: show,
  });

  const categories =
    dropdown?.data.subKategoriAset.map((item) => ({
      value: item.subAsetId,
      label: item.nameSubAset,
    })) ?? [];

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: LocationValues) =>
      locationId === undefined
        ? createLocation(data)
        : updateLocation(data, locationId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          `${locationId === undefined ? 'Menambah' : 'Edit'} lokasi gagal`
      );
    },
  });

  const onSubmit = (data: LocationValues) => {
    console.log(data);
    mutateAsync(data);
  };

  useEffect(() => {
    if (show) {
      if (isEdit && locationData?.data) {
        reset({
          lokasi: locationData.data.lokasi,
          kategori: locationData.data.subKategoriAset.map(
            (item: any) => item.nameSubAset
          ),
        });
      } else if (!isEdit) {
        reset({
          lokasi: '',
          kategori: [],
        });
      }
    }
  }, [show, isEdit, locationData, reset]);

  if (
    !show ||
    (isEdit && (isLoading || !locationData?.data || isLoadingDropdown))
  ) {
    return null;
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {locationId ? 'Edit Lokasi' : 'Add Lokasi'}
          </DialogTitle>
          <DialogDescription>
            {locationId
              ? 'Edit location info'
              : 'Create a new asset storage place'}
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
                Lokasi <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                type='name'
                placeholder='e.g Gudang 1'
                {...register('lokasi')}
              />
              {errors.lokasi && (
                <p className='text-red-500 text-sm'>{errors.lokasi.message}</p>
              )}
            </div>
            {isEdit && (
              <div className='grid gap-3'>
                <Label htmlFor='role'>
                  Kategori Aset <span className='text-red-500'>*</span>
                </Label>
                <MultiSelectCategories
                  selectedCategories={watch('kategori') || []}
                  onCategoriesChange={(vals) =>
                    setValue('kategori', vals ?? [])
                  }
                  placeholder='e.g Kategori 1, Kategori 2'
                  category={categories}
                />
                {errors.kategori && (
                  <p className='text-red-500 text-sm'>
                    {errors.kategori.message}
                  </p>
                )}
              </div>
            )}

            <div className='flex justify-end mt-3'>
              <Button
                variant={'asa'}
                type='submit'
                className='w-fit'
                disabled={isPending}
              >
                {locationId
                  ? isPending
                    ? 'Updating...'
                    : 'Update Lokasi'
                  : isPending
                  ? 'Adding Location...'
                  : 'Add Location'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
