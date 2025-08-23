import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { Asset } from '@/services/asset/asset.type';
import { Download } from 'lucide-react';
import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

export default function ViewAsset() {
  const detail = useLoaderData();

  const [loading, setLoading] = useState(false);

  const qrUrl = '/uploads/qrcodes/20250821-FSK-814.png';

  return (
    <div className='flex justify-center items-center text-accent-foreground'>
      <div className='flex flex-col bg-white w-full h-full rounded-sm p-5 mb-5'>
        <div>
          <h1 className='text-2xl font-medium'>View Asset</h1>
          <p className='text-gray-400'>Details of the asset {detail}</p>
        </div>

        <div className='flex gap-3 mt-5'>
          <div className='border-2 p-10 rounded-sm flex flex-col items-center'>
            <div className='w-[200px] h-[200px] mb-2'>
              {loading ? (
                <Skeleton className='w-full h-full rounded-lg' />
              ) : (
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}${qrUrl}`}
                  alt='qrcode'
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    loading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setLoading(false)}
                />
              )}
            </div>

            <Button variant={'asaOutline'} className='mt-2'>
              Download PNG <Download />
            </Button>
          </div>

          <div className='p-5'>
            <div className='overflow-x-auto flex gap-5 h-full'>
              
                  {[...Array(5)].map((_, index) => (
                    
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_IMAGE_URL}${qrUrl}`}
                      alt='qrcode'
                      className={`w-full h-full  transition-opacity duration-300 ${
                        loading ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={() => setLoading(false)}
                    />
                  ))}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 '>
          <div className='grid gap-3'>
            <Label htmlFor='name'>Asset ID</Label>
            <Input
              id='name'
              type='name'
              value={detail}
              disabled
              className='bg-gray-300'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
