import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Asset } from '@/services/asset/asset.type';
import { CheckCircle2, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Asset;
}

export default function ModalAddAsset({
  open,
  onOpenChange,
  data,
}: AddAssetDialogProps) {
  if (!data) return null;

  console.log(data);
  const assetId = data?.asetId ?? '';
  const qrUrl = data?.urlQR ?? '';
  const kategoriAset = data?.kategoriAset
  console.log(qrUrl);

  const [loading, setLoading] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(assetId);
      toast.success('Berhasil salin Asset ID');
    } catch (err) {
      console.error('Gagal menyalin teks: ', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {/* {category === "Physical" ? <Package className="h-5 w-5" /> : <HardDrive className="h-5 w-5" />} */}
            {kategoriAset === 'asetFisik' ? 'Aset Fisik' : 'Aset Digital'}{' '}
            berhasil ditambahkan!
          </DialogTitle>
          <DialogDescription>
            {kategoriAset === 'asetFisik'
              ? 'QR dan Asset ID sudah digenerate!'
              : `Aset ${data.merkDanTipe} berhasil ditambahkan`}
          </DialogDescription>
        </DialogHeader>

        <div className='w-full h-full'>
          <div className='flex flex-col items-center'>
            {/* QR Placeholder */}
            <div className='w-[200px] h-[200px] mb-2'>
              {kategoriAset === 'asetFisik' ? (
                <>
                  {loading && <Skeleton className='w-full h-full rounded-sm' />}
                  <img
                    src={`${import.meta.env.VITE_IMAGE_URL}${qrUrl}`}
                    alt='qrcode'
                    className={`w-full h-full object-contain transition-opacity duration-300 ${
                      loading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setLoading(false)}
                  />
                </>
              ) : (
                <div className='flex w-full h-full items-center justify-center'>
                  <CheckCircle2 className='w-32 h-32 text-green-500' />
                </div>
              )}
            </div>
            <div className='flex flex-col items-center'>
              <p className='font-semibold'>Asset ID</p>
              {loading ? (
                <Skeleton className='h-5 w-32 mt-1' />
              ) : (
                <p className='inline-flex gap-2 items-center'>
                  {assetId}{' '}
                  <button
                    onClick={handleCopy}
                    className='hover:text-blue-500 transition-colors'
                  >
                    <Copy size={18} />
                  </button>
                </p>
              )}
            </div>

            <div className='w-full h-full flex justify-end items-end mt-7'>
              <div className='flex gap-3'>
                {kategoriAset === 'asetFisik' && (
                  <Button variant={'asaOutline'}>
                    Download PNG <Download />
                  </Button>
                )}

                <Button variant={'asa'}>Okay</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
