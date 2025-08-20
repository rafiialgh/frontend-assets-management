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
import { cn } from '@/lib/utils';
import { AssetSchema, type AssetValues } from '@/services/asset/asset.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function AsetForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssetValues>({
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      foto: [],
      merkDanTipe: '',
      tahun: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setValue('foto', files, { shouldValidate: true });
  };

  const onSubmit = async (data: AssetValues) => {
    console.log(data);
  };

  const kategoriAset = watch('kategoriAset');

  return (
    <div className='flex justify-center items-center text-accent-foreground'>
      <div className='flex flex-col bg-white w-full h-fit rounded-sm p-5'>
        <div>
          <h1 className='text-2xl font-medium'>Add Asset</h1>
          <p className='text-gray-400'>Provide details of the asset</p>
        </div>

        <div>
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.log('Validation errors:', errors);
            })}
            className={cn('flex flex-col gap-6', className)}
            {...props}
          >
            {kategoriAset !== 'digital' && (
              <div className='mt-5'>
                <Controller
                  name='foto'
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
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
            <div className='grid grid-flow-row md:grid-flow-col md:grid-rows-5 grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
              <div className='grid gap-3'>
                <Label htmlFor='merk & tipe'>
                  Merk & Tipe <span className='text-red-500'>*</span>{' '}
                  {errors.merkDanTipe && (
                    <p className='text-red-500 text-sm'>
                      {errors.merkDanTipe.message}
                    </p>
                  )}
                </Label>
                <Input
                  id='merk & tipe'
                  type='text'
                  placeholder={'Nama merk dan tipe'}
                  {...register('merkDanTipe')}
                />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='tahun pembuatan'>
                  Tahun Pembuatan <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='tahun pembuatan'
                  type='number'
                  placeholder={'Tahun pembuatan'}
                  {...register('tahun', { valueAsNumber: true })}
                />
                {errors.tahun && (
                  <p className='text-red-500 text-sm'>{errors.tahun.message}</p>
                )}
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='kategori aset'>
                  Kategori Aset <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='kategori aset'
                  type='text'
                  placeholder={'Kategori aset'}
                  {...register('kategoriAset')}
                />
                {errors.kategoriAset && (
                  <p className='text-red-500 text-sm'>
                    {errors.kategoriAset.message}
                  </p>
                )}
              </div>

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
              <div className='grid gap-3'>
                <Label htmlFor='kondisi'>
                  Kondisi <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='kondisi'
                  type='text'
                  placeholder={'Baik / Normal / Buruk'}
                  {...register('kondisiAset')}
                />
                {errors.kondisiAset && (
                  <p className='text-red-500 text-sm'>
                    {errors.kondisiAset.message}
                  </p>
                )}
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='status aset'>
                  Status Aset <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='status aset'
                  type='text'
                  placeholder={'Aktif / Non Aktif / Maintenance'}
                  {...register('statusAset')}
                />
                {errors.statusAset && (
                  <p className='text-red-500 text-sm'>
                    {errors.statusAset.message}
                  </p>
                )}
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='lokasi'>
                  Lokasi <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='lokasi'
                  type='text'
                  placeholder={'Lokasi penempatan?'}
                  {...register('lokasiId')}
                />
                {errors.lokasiId && (
                  <p className='text-red-500 text-sm'>
                    {errors.lokasiId.message}
                  </p>
                )}
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='status kepemilikan'>
                  Status Kepemilikan <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='status kepemilikan'
                  type='text'
                  placeholder={'Status kepemilikan'}
                  {...register('statusKepemilikan')}
                />
                {errors.statusKepemilikan && (
                  <p className='text-red-500 text-sm'>
                    {errors.statusKepemilikan.message}
                  </p>
                )}
              </div>

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
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-gray-400'>
                Asset ID and QR code are generated automatically once all
                required fields are filled.
              </p>
              <Button variant={'asa'} type='submit' className='w-fit'>
                Add Aset
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
