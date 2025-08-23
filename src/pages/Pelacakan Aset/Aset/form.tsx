import ImageUpload from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  addAsset,
  AssetSchema,
  type AssetValues,
} from '@/services/asset/asset.service';
import { getDropdown } from '@/services/global/global.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ModalAddAsset from './modal';

export default function AsetForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AssetValues>({
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      foto: [],
      tahun: '',
      merkDanTipe: '',
      masaBerlaku: '',
      pic: '',
      kategoriAset: '',
      subKategoriAset: '',
      statusKepemilikan: '',
      lokasiId: '',
      statusAset: '',
      kondisiAset: '',
      nomorSeri: '',
    },
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [assetData, setAssetData] = useState<any>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormData) => addAsset(data),
    onSuccess: (data) => {
      toast.success(data.message);
      setAssetData(data.data);
      setIsAddDialogOpen(true);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || 'Gagal add asset'
      );
    },
  });

  const { data: dropdown } = useQuery({
    queryKey: ['dropdown'],
    queryFn: () => getDropdown(),
  });

  const onSubmit = async (data: AssetValues) => {
    console.log(data);
    const formData = new FormData();

    if (Array.isArray(data.foto)) {
      data.foto.forEach((file) => {
        formData.append('foto', file);
      });
    }

    if (data.kategoriAset) {
      const kategoriFormat = data.kategoriAset
        .replace(/\s+/g, '')
        .replace(/^./, (c) => c.toLowerCase());

      formData.append('kategoriAset', kategoriFormat);
    }

    if (data.kondisiAset) {
      formData.append('kondisiAset', data.kondisiAset);
    }

    if (data.lokasiId) {
      formData.append('lokasiId', data.lokasiId);
    }

    if (data.masaBerlaku) {
      formData.append('masaBerlaku', data.masaBerlaku);
    }

    if (data.merkDanTipe) {
      formData.append('merkDanTipe', data.merkDanTipe);
    }

    if (data.nomorSeri) {
      formData.append('nomorSeri', data.nomorSeri);
    }

    if (data.pic) {
      formData.append('pic', data.pic);
    }

    if (data.statusAset) {
      formData.append('statusAset', data.statusAset);
    }

    if (data.statusKepemilikan) {
      formData.append(
        'statusKepemilikan',
        data.statusKepemilikan.replace(/\s+/g, '')
      );
    }

    if (data.subKategoriAset) {
      formData.append(
        'subKategoriAset',
        data.subKategoriAset.replace(/\s+/g, '')
      );
    }

    if (data.tahun && data.tahun.trim() !== '') {
      formData.append('tahun', data.tahun);
    }

    try {
      const response = await mutateAsync(formData);
      console.log('Upload success:', response);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const kategoriAset = watch('kategoriAset');
  const statusKepemilikan = watch('statusKepemilikan');
  const isDigital = kategoriAset === 'Aset Digital';
  const isPribadi = statusKepemilikan === 'Pribadi';

  useEffect(() => {
    if (kategoriAset) {
      reset({
        foto: [],
        tahun: '',
        merkDanTipe: '',
        masaBerlaku: '',
        pic: '',
        kategoriAset,
        subKategoriAset: '',
        statusKepemilikan: '',
        lokasiId: '',
        statusAset: '',
        kondisiAset: '',
        nomorSeri: '',
      });
    }
  }, [kategoriAset, reset]);

  return (
    <div className='flex justify-center items-center text-accent-foreground'>
      <div className='flex flex-col bg-white w-full h-full rounded-sm p-5'>
        <div>
          <h1 className='text-2xl font-medium'>Add Asset</h1>
          <p className='text-gray-400'>Provide details of the asset</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-6', className)}
          {...props}
        >
          {!isDigital && (
            <div className='mt-5'>
              <Controller
                name='foto'
                control={control}
                render={({ field }) => (
                  <ImageUpload value={field.value} onChange={field.onChange} disabled={!kategoriAset} />
                )}
              />
              {errors.foto && (
                <p className='text-red-500 text-sm mt-1'>
                  {/* @ts-ignore */}
                  {errors.foto.message}
                </p>
              )}
            </div>
          )}
          <div
            className={cn(
              'grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-2 gap-7 mt-5',
              {
                'md:grid-rows-5':
                  !kategoriAset || kategoriAset === 'Aset Fisik',
                'md:grid-rows-3': kategoriAset === 'Aset Digital',
              }
            )}
          >
            <div className='grid gap-3'>
              <Label htmlFor='kategori aset'>
                Kategori Aset <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='kategoriAset'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Pilih kategori' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Kategori</SelectLabel>
                        {dropdown?.data.kategoriAset.map((kat) => (
                          <SelectItem key={kat} value={kat}>
                            {kat}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.kategoriAset && (
                <p className='text-red-500 text-sm'>
                  {errors.kategoriAset.message}
                </p>
              )}
            </div>

            {!isDigital && (
              <div className='grid gap-3'>
                <Label htmlFor='sub kategori aset'>
                  Jenis Aset <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='subKategoriAset'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Pilih jenis ketegori' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Jenis kategori</SelectLabel>
                          {dropdown?.data.subKategoriAset.map((sub) => (
                            <SelectItem
                              key={sub.subAsetId}
                              value={sub.subAsetId}
                              className='capitalize'
                            >
                              {sub.nameSubAset}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subKategoriAset && (
                  <p className='text-red-500 text-sm'>
                    {errors.subKategoriAset.message}
                  </p>
                )}
              </div>
            )}

            <div className='grid gap-3'>
              <Label htmlFor='merk & tipe'>
                Nama Aset <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='merk & tipe'
                type='text'
                placeholder={'Nama merk dan tipe'}
                {...register('merkDanTipe')}
              />
              {errors.merkDanTipe && (
                <p className='text-red-500 text-sm'>
                  {errors.merkDanTipe.message}
                </p>
              )}
            </div>

            {!isDigital && (
              <div className='grid gap-3'>
                <Label htmlFor='tahun pembuatan'>
                  Tahun Pembuatan <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='tahun pembuatan'
                  type='number'
                  placeholder={'Tahun pembuatan'}
                  {...register('tahun')}
                />
                {errors.tahun && (
                  <p className='text-red-500 text-sm'>{errors.tahun.message}</p>
                )}
              </div>
            )}

            {!isDigital && (
              <div className='grid gap-3'>
                <Label htmlFor='nomor seri'>
                  Nomor Seri <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='nomor seri'
                  type='text'
                  placeholder={'Nomor seri'}
                  {...register('nomorSeri')}
                />
                {errors.nomorSeri && (
                  <p className='text-red-500 text-sm'>
                    {errors.nomorSeri.message}
                  </p>
                )}
              </div>
            )}

            {!isDigital && (
              <div className='grid gap-3'>
                <Label htmlFor='kondisi'>
                  Kondisi <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='kondisiAset'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Baik / Normal / Buruk' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Kondisi</SelectLabel>
                          {dropdown?.data.kondisiAset.map((kon) => (
                            <SelectItem
                              key={kon}
                              value={kon}
                              className='capitalize'
                            >
                              {kon}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.kondisiAset && (
                  <p className='text-red-500 text-sm'>
                    {errors.kondisiAset.message}
                  </p>
                )}
              </div>
            )}

            {!isDigital && (
              <div className='grid gap-3'>
                <Label htmlFor='status aset'>
                  Status Aset <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='statusAset'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Aktif / Nonaktif / Maintenance' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          {dropdown?.data.statusAset.map((stat) => (
                            <SelectItem
                              key={stat}
                              value={stat}
                              className='capitalize'
                            >
                              {stat}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.statusAset && (
                  <p className='text-red-500 text-sm'>
                    {errors.statusAset.message}
                  </p>
                )}
              </div>
            )}

            {!isDigital && (
              <div className='grid gap-3'>
                <Label htmlFor='lokasi'>
                  Lokasi <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='lokasiId'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Pilih Lokasi' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Lokasi</SelectLabel>
                          {dropdown?.data.lokasi.map((lok) => (
                            <SelectItem
                              key={lok.idLokasi}
                              value={lok.idLokasi}
                              className='capitalize'
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
                  <p className='text-red-500 text-sm'>
                    {errors.lokasiId.message}
                  </p>
                )}
              </div>
            )}

            <div className='grid gap-3'>
              <Label htmlFor='hak milik'>
                Hak Milik <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='statusKepemilikan'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Pilih hak milik' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Hak milik</SelectLabel>
                        {dropdown?.data.hakMilik.map((hak) => (
                          <SelectItem
                            key={hak}
                            value={hak}
                            className='capitalize'
                          >
                            {hak}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.statusKepemilikan && (
                <p className='text-red-500 text-sm'>
                  {errors.statusKepemilikan.message}
                </p>
              )}
            </div>

            {isPribadi && (
              <div className='grid gap-3'>
                <Label htmlFor='pic'>
                  Person in Charge (PIC) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='pic'
                  type='text'
                  placeholder={'Person in Charge (PIC)'}
                  {...register('pic')}
                />
                {errors.pic && (
                  <p className='text-red-500 text-sm'>{errors.pic.message}</p>
                )}
              </div>
            )}

            {isDigital && (
              <div className='grid gap-3'>
                <Label htmlFor='masa berlaku'>
                  Masa Berlaku <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  control={control}
                  name='masaBerlaku'
                  rules={{ required: 'Masa berlaku wajib diisi' }}
                  render={({ field }) => {
                    const dateValue = field.value
                      ? new Date(field.value)
                      : undefined;
                    const [open, setOpen] = React.useState(false);

                    return (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            id='masaBerlaku'
                            className='w-full justify-between font-normal text-gray-500'
                          >
                            {dateValue
                              ? dateValue.toLocaleDateString()
                              : 'Select date'}
                            <CalendarDays />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className='w-auto overflow-hidden p-0'
                          align='start'
                        >
                          <Calendar
                            mode='single'
                            selected={dateValue || undefined}
                            captionLayout='dropdown'
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : ''); // simpan string
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
                {errors.masaBerlaku && (
                  <p className='text-red-500 text-sm'>
                    {errors.masaBerlaku.message}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-gray-400'>
              Asset ID and QR code are generated automatically once all required
              fields are filled.
            </p>
            <Button
              variant={'asa'}
              type='submit'
              className='w-fit'
              disabled={isPending}
            >
              {isPending ? 'Adding Aset...' : 'Add Aset'}
            </Button>
          </div>
        </form>
      </div>
      <ModalAddAsset open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} data={assetData}/>
    </div>
  );
}