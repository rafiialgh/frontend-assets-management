import { StatCard } from '@/components/StatCard';
import { Plus, User, Users, UserStar } from 'lucide-react';
import { columns } from './columns';
import UserForm from './form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from './table';
import { useDebounce } from '@/hooks/useDebounce';
import { getUsers } from '@/services/auth/auth.service';
import { useQuery } from '@tanstack/react-query';
import { StatCardSkeleton, TableSkeleton } from '@/components/Skeleton';
import type { GetUsersResponse } from '@/services/auth/auth.type';

export default function UserPage() {
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 10;

  // State untuk input pencarian langsung
  const [search, setSearch] = useState<string>('');
  // State untuk nilai yang sudah di-debounce
  const debouncedSearch = useDebounce(search, 500); // Tunda 500ms

  const { data, isLoading, error } = useQuery<GetUsersResponse>({
    queryKey: ['users', roleFilter, debouncedSearch, page, limit],
    queryFn: () =>
      getUsers({ role: roleFilter, search: debouncedSearch, page, limit }),
    // keepPreviousData: true, // Sebaiknya diaktifkan untuk UX yang lebih baik
  });

  console.log(data);

  const users = data?.data ?? [];
  const pagination = data?.pagination;
  const summary = data?.summary;

  // Fungsi untuk menangani perubahan filter & reset halaman ke 1
  const handleRoleFilterChange = (value: string | undefined) => {
    setPage(1); // Reset halaman ke 1 setiap kali filter berubah
    setRoleFilter(value);
  };

  const handleSearchChange = (value: string) => {
    setPage(1); // Reset halaman ke 1 setiap kali pencarian dimulai
    setSearch(value);
  };

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
        <StatCard
          icon={User}
          title='Total Users'
          value={summary?.totalUsers ?? 0}
        />
        <StatCard
          icon={UserStar}
          title='Online Users'
          value={summary?.totalAktifUser ?? 0}
        />
        <div className='flex justify-between bg-sidebar border rounded-sm items-center w-full h-[95px] px-4 hover:bg-gray-100 hover:-translate-y-0.5 transition-all col-span-2'>
          <div className='flex items-center gap-2'>
            <Users size={35} className='text-gray-400' />
          </div>
          <div>
            <Badge variant={'superadmin'}>Super Admin</Badge>
            <p className='text-2xl text-right'>
              {summary?.totalSuperAdmin ?? 0}
            </p>
          </div>
          <div>
            <Badge variant={'admin'}>Admin</Badge>
            <p className='text-2xl text-right'>{summary?.totalAdmin ?? 0}</p>
          </div>
          <div>
            <Badge variant={'maintenance'}>Maintenance</Badge>
            <p className='text-2xl text-right'>
              {summary?.totalMaintenance ?? 0}
            </p>
          </div>
        </div>
      </div>

      <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
        <h1 className='font-medium text-xl mb-5'>Pengguna</h1>

        <DataTable
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
        />
      </div>

      {/* Modal */}
      <UserForm show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
