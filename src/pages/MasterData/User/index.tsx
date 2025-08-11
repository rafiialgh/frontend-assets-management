import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/ui/data-table';
import { LucideUserCheck, Plus, User, UserCog, UserStar } from 'lucide-react';
import { columns } from './columns';

export default function UserPage() {

  const data = [
    {
      _id: '102910213',
      name: 'Rafii',
      email: 'rafii.alghafari.gmail.com',
      role: 'maintenance',
      lastLogin: "2025-08-07 12:30",
      createdAt: "2025-08-07 12:30",
      updatedAt: "2025-08-07 12:30",
    },
    {
      _id: '82349124',
      name: 'Jokowi',
      email: 'joko.wi@gmail.com',
      role: 'admin',
      lastLogin: "2025-08-07 12:30",
      createdAt: "2025-08-07 12:30",
      updatedAt: "2025-08-07 12:30",
    },
    {
      _id: '37438483',
      name: 'Bahlil',
      email: 'bahli@gmail.com',
      role: 'superadmin',
      lastLogin: "2025-08-07 12:30",
      createdAt: "2025-08-07 12:30",
      updatedAt: "2025-08-07 12:30",
    },
  ]

  return (
    <div className='text-accent-foreground'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-medium'>Role Pengguna</h1>
        <a href=''>
          <div className='flex justify-center items-center py-2 px-3 bg-[#277292] text-white rounded-md hover:bg-[#277292]/90 transition-colors'>
            <Plus className='mr-1' size={20}/>
            <p>Add User</p>
          </div>
        </a>
      </div>

      <div className='mt-5 grid grid-cols-2 xl:grid-cols-4 gap-5 justify-between items-center'>
        <StatCard icon={User} title='Total Users' value={12} />
        <StatCard icon={UserStar} title='Superadmin' value={4} />
        <StatCard icon={LucideUserCheck} title='Admin' value={3} />
        <StatCard icon={UserCog} title='Maintenance' value={5} />
      </div>

      <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
        <h1 className='font-medium text-xl mb-5'>Pengguna</h1>
        <DataTable columns={columns} data={data}/>
      </div>
    </div>
  );
}
