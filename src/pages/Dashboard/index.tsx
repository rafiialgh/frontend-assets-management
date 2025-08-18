import { StatCard } from '@/components/StatCard';
import { Package } from 'lucide-react';
import React from 'react';

export default function Dashboard() {
  return (
    <div className='text-accent-foreground'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-medium'>Dashboard</h1>
        {/* <Button
          type='button'
          variant={'asa'}
          onClick={() => setShowModal(true)}
          className='flex justify-center items-center'
        >
          <Plus className='mr-1' size={20} />
          <p>Add Lokasi</p>
        </Button> */}
      </div>

      <div className='mt-5 grid grid-cols-2 xl:grid-cols-4 gap-5 justify-between items-center'>
        <StatCard icon={Package} title='Total' value={10} />
        <StatCard icon={Package} title='Total' value={10} />
        <StatCard icon={Package} title='Total' value={10} />
        <StatCard icon={Package} title='Total' value={10} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
          <h1 className='font-medium text-xl mb-5'>
            Lokasi Penempatan{' '}
            <span className='font-light text-gray-400 text-lg'>{``}</span>
          </h1>
        </div>

        <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
          <h1 className='font-medium text-xl mb-5'>
            Lokasi Penempatan{' '}
            <span className='font-light text-gray-400 text-lg'>{``}</span>
          </h1>
        </div>
      </div>

      <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
          <h1 className='font-medium text-xl'>Recent Activities <span className='font-light text-gray-400 text-lg'>[0]</span></h1>
      </div>
    </div>
  );
}
