import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { columns } from './columns'
import { DataTable } from './table'
import LocationForm from './form'
import { useQuery } from '@tanstack/react-query'
import { getLocation } from '@/services/location/location.service'

export default function LocationPage() {
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, error} = useQuery({
    queryKey: ['locations'],
    queryFn: () => getLocation(),
  })

  console.log(data)


  return (
    <div className='text-accent-foreground'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-medium'>Lokasi</h1>
        <Button
          type='button'
          variant={'asa'}
          onClick={() => setShowModal(true)}
          className='flex justify-center items-center'
        >
          <Plus className='mr-1' size={20} />
          <p>Add Lokasi</p>
        </Button>
      </div>

      <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
        <h1 className='font-medium text-xl mb-5'>Lokasi Penempatan <span className='font-light text-gray-400 text-lg'>{`[${data?.totalLokasi ?? 0}]`}</span></h1>
        <DataTable columns={columns} data={data?.data ?? []} />
      </div>

      {/* Modal */}
      <LocationForm show={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
