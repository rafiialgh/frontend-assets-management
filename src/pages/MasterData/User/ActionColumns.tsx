import { Button } from '@/components/ui/button';
import { deleteUsers } from '@/services/auth/auth.service';
import { useMutation } from '@tanstack/react-query';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import UserForm from './form';
import { useState } from 'react';

interface ActionColumnProps {
  id: string;
}

export default function ActionColumns({ id }: ActionColumnProps) {
  const [showModal, setShowModal] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteUsers(id),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || 'Hapus user gagal'
      );
    },
  });

  const handleDelete = async () => {
    if (!confirm('Yakin ingin hapus user ini?')) return;
    // await mutateAsync()
    console.log(id);
  };

  return (
    <>
      <div className='inline-flex items-center gap-4 p-5'>
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
          size='sm'
          variant={'secondary'}
          className='hover:bg-red-500 hover:text-white'
          onClick={handleDelete}
        >
          <Trash className='w-4 h-4' />
          {/* Delete */}
        </Button>
      </div>
      {showModal && (
      <UserForm
        show={showModal}
        onClose={() => setShowModal(false)}
        userId={id}
      />
      )}
    </>
  );
}
