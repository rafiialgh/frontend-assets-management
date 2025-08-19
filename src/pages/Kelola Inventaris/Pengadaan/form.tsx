import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  getAssetCategories,
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
    reset, watch,
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

  const watchedJumlah = watch('jumlahAset');
const watchedHarga = watch('hargaSatuan');

useEffect(() => {
  console.log('Jumlah Aset updated:', watchedJumlah);
}, [watchedJumlah]);

useEffect(() => {
  console.log('Harga Satuan updated:', watchedHarga);
}, [watchedHarga]);

  const queryClient = useQueryClient();

  // Ambil data lokasi
  const { data: lokasiData, isLoading: lokasiLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocation,
  });

  // Ambil kategori aset dari backend
  const { data: kategoriData, isLoading: kategoriLoading } = useQuery({
    queryKey: ['asset-categories'],
    queryFn: getAssetCategories,
  });

  // Ambil detail procurement jika edit
  const { data: procurementData, isFetching } = useQuery({
    queryKey: ['procurement', procurementId],
    queryFn: () => getProcurementById(procurementId!),
    enabled: !!procurementId && show,
  });

  // Mutasi add / edit
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ProcurementValues) =>
      isEdit ? updateProcurement(data, procurementId!) : addProcurement(data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['procurements']);
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || 'Gagal memproses pengadaan'
      );
    },
  });

  const onSubmit = async (data: ProcurementValues) => {
    await mutateAsync({
      ...data,
      jumlahAset: Number(data.jumlahAset),
      hargaSatuan: Number(data.hargaSatuan),
    });
  };
  // useEffect(() => {
  //   console.log('Kategori aset raw:', kategoriData);
  // }, [kategoriData]);

  // useEffect(() => {
  //   console.log('Data lokasi raw:', lokasiData);
  // }, [lokasiData]);


  useEffect(() => {
    if (show) {
      if (isEdit && procurementData?.data) {
        const data = procurementData.data;
        console.log('Procurement lokasiId (backend):', data.lokasi?.idLokasi ?? '');
       
        reset({
          tanggalBeli: data.tanggalBeli,
          lokasiId: data.lokasi?.idLokasi ?? '', 
          kategoriAset: data.kategoriAset?.toLowerCase() ?? '', 
          namaAset: data.namaAset,
          jumlahAset: String(data.jumlahAset),
          hargaSatuan: String(data.hargaSatuan),
          vendor: data.vendor,
        });
      } else if (!isEdit) {
        reset({
          tanggalBeli: '',
          lokasiId: '',
          kategoriAset: '',
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
    <div
      className={cn(
        'fixed inset-0 bg-black/50 z-50 flex justify-center items-center text-accent-foreground transition-opacity duration-300',
        show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none hidden'
      )}
      onClick={onClose}
    >
      <div
        className="flex flex-col bg-white m-5 w-full h-fit max-w-[500px] rounded-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end">
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="text-gray-500 cursor-pointer hover:scale-125" />
          </button>
        </div>

        {/* Title */}
        <div className="mt-[10px]">
          <p className="text-2xl font-medium">
            {procurementId ? 'Edit Pengadaan' : 'Add Pengadaan'}
          </p>
          <p className="text-gray-400">
            {procurementId ? 'Edit Procurement data' : 'Add a new procurement'}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-6', className)}
          {...props}
        >
          <div className="grid gap-3 mt-5">
            {/* Tanggal Beli */}
            <div className="grid gap-3">
              <Label htmlFor="tanggalBeli">
                Tanggal Beli <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="tanggalBeli"
                render={({ field }) => {
                  const dateValue = field.value ? new Date(field.value) : undefined;
                  const [open, setOpen] = React.useState(false);
                  return (
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="tanggalBeli"
                          className="w-full justify-between font-normal text-gray-500"
                        >
                          {dateValue ? dateValue.toLocaleDateString() : 'Pilih tanggal'}
                          <CalendarDays />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateValue}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date ? date.toISOString() : '');
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
              {errors.tanggalBeli && <p className="text-red-500 text-sm">{errors.tanggalBeli.message}</p>}
            </div>

            <div className="flex gap-4">
              {/* Lokasi */}
              <div className="flex-1 grid gap-2">
                <Label htmlFor="lokasiId">
                  Lokasi Penempatan <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="lokasiId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={lokasiLoading ? 'Loading lokasi...' : 'Pilih lokasi'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Lokasi</SelectLabel>
                          {lokasiData?.data?.map((lok) => (
                            <SelectItem key={lok.idLokasi} value={lok.idLokasi.toString()}>
                              {lok.lokasi}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.lokasiId && <p className="text-red-500 text-sm">{errors.lokasiId.message}</p>}
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
                        <SelectValue placeholder={kategoriLoading ? 'Loading kategori...' : 'Pilih kategori aset'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Kategori</SelectLabel>
                          {kategoriData?.data?.kategoriAset?.map((kategori: string) => (
                            <SelectItem key={kategori} value={kategori}>
                              {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                            </SelectItem>
                          ))}

                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.kategoriAset && <p className="text-red-500 text-sm">{errors.kategoriAset.message}</p>}
              </div>
            </div>

            {/* Nama Aset */}
            <div className="grid gap-3">
              <Label htmlFor="namaAset">
                Nama Aset <span className="text-red-500">*</span>
              </Label>
              <Input id="namaAset" {...register('namaAset')} placeholder="Masukkan nama aset" />
              {errors.namaAset && <p className="text-red-500 text-sm">{errors.namaAset.message}</p>}
            </div>

            <div className="flex gap-4">
              {/* Jumlah Aset */}
              <div className="grid gap-3">
                <Label htmlFor="jumlahAset">
                  Jumlah Aset <span className="text-red-500">*</span>
                </Label>
                <Input id="jumlahAset" type="number" {...register('jumlahAset')} placeholder="Jumlah yang diadakan" />
                {errors.jumlahAset && <p className="text-red-500 text-sm">{errors.jumlahAset.message}</p>}
              </div>

              {/* Harga Satuan */}
              <div className="grid gap-3">
                <Label htmlFor="hargaSatuan">
                  Harga Satuan <span className="text-red-500">*</span>
                </Label>
                <Input id="hargaSatuan" type="number" {...register('hargaSatuan')} placeholder="Harga per aset" />
                {errors.hargaSatuan && <p className="text-red-500 text-sm">{errors.hargaSatuan.message}</p>}
              </div>
            </div>

            {/* Vendor */}
            <div className="grid gap-3">
              <Label htmlFor="vendor">
                Vendor <span className="text-red-500">*</span>
              </Label>
              <Input id="vendor" {...register('vendor')} placeholder="Vendor yang digunakan" />
              {errors.vendor && <p className="text-red-500 text-sm">{errors.vendor.message}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-3">
              <Button variant="asa" type="submit" className="w-fit" disabled={isPending || isFetching}>
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
  );
}
