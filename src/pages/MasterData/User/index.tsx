import { StatCard } from '@/components/StatCard';
import {
  LucideUserCheck,
  Plus,
  User,
  UserCog,
  Users,
  UserStar,
} from 'lucide-react';
import { columns } from './columns';
import UserForm from './form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from './table';
import { useLoaderData } from 'react-router-dom';
import type { UserType } from '@/services/user/user.type';
import type { Pagination, Summary } from '@/services/auth/auth.type';

export default function UserPage() {

  const { data: users, pagination, summary } = useLoaderData() as {
  data: UserType[];
  pagination: Pagination;
  summary: Summary;
};
  console.log(users)

  const [showModal, setShowModal] = useState(false);

  return (
    <div className='text-accent-foreground'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-medium'>Role Pengguna</h1>
        <Button
          type='button'
          variant={'asa'}
          onClick={() => setShowModal(true)}
          className='flex justify-center items-center'
        >
          <Plus className='mr-1' size={20} />
          <p>Add User</p>
        </Button>
      </div>

      <div className='mt-5 grid grid-cols-2 xl:grid-cols-4 gap-5 justify-between items-center'>
        <StatCard icon={User} title='Total Users' value={summary.totalUsers} />
        <StatCard icon={UserStar} title='Online Users' value={summary.totalAktifUser} />
        <div className='flex justify-between bg-sidebar border rounded-sm items-center w-full h-[95px] px-4 hover:bg-gray-100 hover:-translate-y-0.5 transition-all col-span-2'>
          <div className='flex items-center gap-2'>
            <Users size={35} className='text-gray-400' />
          </div>
          <div>
            <Badge variant={'superadmin'}>Super Admin</Badge>
            <p className='text-2xl text-right'>{summary.totalSuperAdmin}</p>
          </div>
          <div>
            <Badge variant={'admin'}>Admin</Badge>
            <p className='text-2xl text-right'>{summary.totalAdmin}</p>
          </div>
          <div>
            <Badge variant={'maintenance'}>Maintenance</Badge>
            <p className='text-2xl text-right'>{summary.totalMaintenance}</p>
          </div>
        </div>
      </div>

      <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
        <h1 className='font-medium text-xl mb-5'>Pengguna</h1>
        <DataTable columns={columns} data={users} />
      </div>

      {/* Modal */}
      <UserForm show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
