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
  addProcurementSchema,
  editProcurementSchema,
  getProcurementById,
  addProcurement,
  updateProcurement,
  type ProcurementValues,
} from '@/services/pengadaan/pengadaan.service';
import { getLocation } from '@/services/location/location.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProcurementFormProps extends React.ComponentProps<'form'> {
  onClose: () => void;
  show: boolean;
  procurementId?: string;
}

export default function ProcurementForm({
  className,
  onClose,
  show,
  procurementId,
  ...props
}: ProcurementFormProps) {
  const isEdit = Boolean(procurementId);
  const schema = isEdit ? editProcurementSchema : addProcurementSchema;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProcurementValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tanggalBeli: '',
      lokasiId: '',
      kategoriAset: undefined,
      namaAset: '',
      jumlahAset: '',
      hargaSatuan: '',
      vendor: '',
    },
  });

  const queryClient = useQueryClient();

  // --- Ambil data lokasi untuk dropdown ---
  const { data: lokasiData, isLoading: lokasiLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocation,
  });

  // --- Ambil detail procurement kalau edit ---
  const {
    data: procurementData,
    isFetching,
  } = useQuery({
    queryKey: ['procurement', procurementId],
    queryFn: () => getProcurementById(procurementId!),
    enabled: !!procurementId && show,
  });

  // --- Mutasi add/edit ---
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ProcurementValues) => {
      if (isEdit) {
        return updateProcurement(data, procurementId!);
      }
      return addProcurement(data);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['procurements'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Gagal memproses pengadaan'
      );
    },
  });

  const onSubmit = async (data: ProcurementValues) => {
    await mutateAsync(data);
  };

  // --- Reset form ketika modal dibuka / data berubah ---
  useEffect(() => {
    if (show) {
      if (isEdit && procurementData?.data) {
        reset({
          tanggalBeli: procurementData.data.tanggalBeli,
          lokasiId: procurementData.data.lokasiId,
          kategoriAset: procurementData.data.kategoriAset as
            | 'furniture'
            | 'elektronik'
            | 'kendaraan',
          namaAset: procurementData.data.namaAset,
          jumlahAset: String(procurementData.data.jumlahAset),
          hargaSatuan: String(procurementData.data.hargaSatuan),
          vendor: procurementData.data.vendor,
        });
      } else if (!isEdit) {
        reset({
          tanggalBeli: '',
          lokasiId: '',
          kategoriAset: undefined,
          namaAset: '',
          jumlahAset: '',
          hargaSatuan: '',
          vendor: '',
        });
      }
    }
  }, [show, isEdit, procurementData, reset]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex justify-center items-center text-accent-foreground transition-opacity duration-300 ${
        show
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none hidden'
      }`}
      onClick={onClose}
    >
      <div
        className='flex flex-col bg-white m-5 w-full h-fit max-w-[500px] rounded-sm p-5'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-end'>
          <button type='button' onClick={onClose} aria-label='Close'>
            <X className='text-gray-500' />
          </button>
        </div>
        <div className='mt-[10px]'>
          <p className='text-2xl font-medium'>
            {procurementId ? 'Edit Pengadaan' : 'Add Pengadaan'}
          </p>
          <p className='text-gray-400'>
            {procurementId
              ? 'Edit Procurement data'
              : 'Add a  new procurement'}
          </p>
        </div>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn('flex flex-col gap-6', className)}
            {...props}
          >
            <div className='grid gap-3 mt-5 '>
              {/* Tanggal Beli */}
              <div className='grid gap-3'>
                <Label htmlFor='tanggalBeli'>
                  Tanggal Beli <span className='text-red-500'>*</span>
                </Label>
                <Input id='tanggalBeli' type='date' {...register('tanggalBeli')} />
                {errors.tanggalBeli && (
                  <p className='text-red-500 text-sm'>
                    {errors.tanggalBeli.message}
                  </p>
                )}
              </div>

            
              <div className="flex gap-4">
                {/* Lokasi Penempatan */}
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="lokasiId">
                    Lokasi Penempatan<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="lokasiId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={lokasiLoading ? "Loading lokasi..." : "Pilih lokasi"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Lokasi</SelectLabel>
                            {lokasiData?.data?.map((lok) => (
                              <SelectItem
                                key={lok.idLokasi}
                                value={lok.idLokasi.toString()}
                              >
                                {lok.lokasi}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.lokasiId && (
                    <p className="text-red-500 text-sm">{errors.lokasiId.message}</p>
                  )}
                </div>

                {/* Kategori Aset */}
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="kategoriAset">
                    Kategori Aset <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="kategoriAset"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kategori aset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Kategori</SelectLabel>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="elektronik">Elektronik</SelectItem>
                            <SelectItem value="kendaraan">Kendaraan</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.kategoriAset && (
                    <p className="text-red-500 text-sm">{errors.kategoriAset.message}</p>
                  )}
                </div>
              </div>


              {/* Nama Aset */}
              <div className='grid gap-3'>
                <Label htmlFor='namaAset'>
                  Nama Aset <span className='text-red-500'>*</span>
                </Label>
                <Input id='namaAset' {...register('namaAset')}  placeholder="Masukkan nama aset" />
                {errors.namaAset && (
                  <p className='text-red-500 text-sm'>{errors.namaAset.message}</p>
                )}
              </div>
              <div className='flex gap-4'>

                {/* Jumlah Aset */}
                <div className='grid gap-3'>
                  <Label htmlFor='jumlahAset'>
                    Jumlah Aset <span className='text-red-500'>*</span>
                  </Label>
                  <Input id='jumlahAset' type='number' {...register('jumlahAset')}  placeholder="Jumlah yang diadakan"/>
                  {errors.jumlahAset && (
                    <p className='text-red-500 text-sm'>
                      {errors.jumlahAset.message}
                    </p>
                  )}
                </div>
                {/* Harga Satuan */}
                <div className='grid gap-3'>
                  <Label htmlFor='hargaSatuan'>
                    Harga Satuan <span className='text-red-500'>*</span>
                  </Label>
                  <Input id='hargaSatuan' type='number' {...register('hargaSatuan')} placeholder="Harga per aset" />
                  {errors.hargaSatuan && (
                    <p className='text-red-500 text-sm'>
                      {errors.hargaSatuan.message}
                    </p>
                  )}
                </div>
              </div>


              {/* Vendor */}
              <div className='grid gap-3'>
                <Label htmlFor='vendor'>
                  Vendor <span className='text-red-500'>*</span>
                </Label>
                <Input id='vendor' {...register('vendor')} placeholder="Vendor yang digunakan" />
                {errors.vendor && (
                  <p className='text-red-500 text-sm'>{errors.vendor.message}</p>
                )}
              </div>

              {/* Submit */}
              <div className='flex justify-end mt-3'>
                <Button
                  variant={'asa'}
                  type='submit'
                  className='w-fit'
                  disabled={isPending || isFetching}
                >
                  {isFetching
                    ? 'Loading...'
                    : procurementId
                    ? isPending
                      ? 'Updating'
                      : 'Update Pengadaan'
                    : isPending
                    ? 'Adding...'
                    : 'Add Pengadaan'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
