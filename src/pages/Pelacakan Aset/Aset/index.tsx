import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Boxes, CircleDotDashed, Plus, SquareStack } from 'lucide-react';
import React from 'react';

export default function Aset() {
  return (
    <div className='text-accent-foreground'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-medium'>Aset</h1>
        <Button
          type='button'
          variant={'asa'}
          className='flex justify-center items-center'
        >
          <Plus className='mr-1' size={20} />
          <p>Add User</p>
        </Button>
      </div>

      <div className='mt-5 grid grid-cols-2 xl:grid-cols-4 gap-5 justify-between items-center'>
        <StatCard icon={Boxes} title='Total Aset' value={0} />
        <StatCard icon={SquareStack} title='Kategori Aset' value={0} />
        <div className='flex justify-between bg-sidebar border rounded-sm items-center w-full h-[95px] px-4 hover:bg-gray-100 hover:-translate-y-0.5 transition-all col-span-2'>
          <div className='flex items-center gap-2'>
            <CircleDotDashed size={35} className='text-gray-400' />
          </div>
          <div>
            <Badge variant={'active'}>Aktif</Badge>
            <p className='text-2xl text-right'>{0}</p>
          </div>
          <div>
            <Badge variant={'nonactive'}>Nonaktif</Badge>
            <p className='text-2xl text-right'>{0}</p>
          </div>
          <div>
            <Badge variant={'maintenanceOutline'}>Maintenance</Badge>
            <p className='text-2xl text-right'>{0}</p>
          </div>
        </div>

        <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
          <h1 className='font-medium text-xl mb-5'>Assets</h1>

          {/* <DataTable
            columns={columns}
            data={users}
            pagination={pagination}
            roleFilter={roleFilter}
            setRoleFilter={handleRoleFilterChange}
            searchFilter={search}
            setSearchFilter={handleSearchChange}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
          /> */}
        </div>
      </div>
    </div>
  );
}
