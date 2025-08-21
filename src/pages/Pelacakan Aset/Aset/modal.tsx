import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalAddAsset({
  open,
  onOpenChange,
}: AddAssetDialogProps) {
  const assetId = 'ID2021093-FSK-239';

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
            Aset Fisik berhasil ditambahkan!
          </DialogTitle>
          <DialogDescription>
            QR dan Asset ID sudah digenerate!
          </DialogDescription>
        </DialogHeader>

        <div className='w-full h-full'>
          <div className='flex flex-col'>
            <img
              src='https://tjmbmb3m-3000.asse.devtunnels.ms/uploads/qrcodes/20250821-FSK-471.png'
              alt='qrcode'
              className='w-full'
            />
            <div className='flex flex-col items-center w-full'>
              <p className='font-semibold'>Asset ID</p>
              <p className='inline-flex gap-2 items-center'>
                {assetId}{' '}
                <button
                  onClick={handleCopy}
                  className='hover:text-blue-500 transition-colors'
                >
                  <Copy size={18} />
                </button>
              </p>
            </div>
            <div className='w-full h-full flex justify-end items-end mt-7'>
              <div className='flex gap-3'>
                <Button variant={'outline'}>
                  Download PNG <Download />
                </Button>
                <Button variant={'asa'}>Okay</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
