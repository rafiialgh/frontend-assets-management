import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash } from 'lucide-react';
import { useState } from 'react';
// import LocationForm from './form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLocation } from '@/services/location/location.service';
import { toast } from 'sonner';

interface ActionColumnProps {
  id: string;
}

export default function ActionColumns({ id }: ActionColumnProps) {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteLocation(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || 'Hapus lokasi gagal'
      );
    },
  });

  const handleDelete = async () => {
    if (!confirm('Yakin ingin hapus user ini?')) return;
    await mutateAsync();
  };

  return (
    <>
      <div className='inline-flex items-center gap-4 p-5'>
        <Button size='sm' variant='secondary' className='hover:bg-gray-200'>
          <Eye />
        </Button>
        <Button
          size='sm'
          variant='secondary'
          className='hover:bg-yellow-400'
          onClick={() => setShowModal(true)}
        >
          <Edit className='w-4 h-4' />
          {/* Edit */}
        </Button>
        <Button
          disabled={isPending}
          onClick={handleDelete}
          size='sm'
          variant={'secondary'}
          className='hover:bg-red-500 hover:text-white'
        >
          <Trash className='w-4 h-4' />
          {/* Delete */}
        </Button>
      </div>
      {/* {showModal && (
        <LocationForm
          show={showModal}
          onClose={() => setShowModal(false)}
          locationId={id}
        />
      )} */}
    </>
  );
}
