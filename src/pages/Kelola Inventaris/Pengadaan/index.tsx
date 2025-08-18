// Components
import { StatCard } from '@/components/StatCard';
import { columns } from './columns';
import ProcurementForm from './form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from './table';
import { StatCardSkeleton, TableSkeleton } from '@/components/Skeleton';

// Icons
import { Plus, User, Users, UserStar } from 'lucide-react';
import { Boxes, Banknote, BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';

// Data
import { useDebounce } from '@/hooks/useDebounce';
import { getUsers } from '@/services/auth/auth.service';
import { useQuery } from '@tanstack/react-query';
import type { GetUsersResponse } from '@/services/auth/auth.type';

export default function UserPage() {
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500); 
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
        <h1 className='text-3xl font-medium'>Pengadaan</h1>
        <Button
          type='button'
          variant={'asa'}
          onClick={() => setShowModal(true)}
          className='flex justify-center items-center'
        >
          <Plus className='mr-1' size={20} />
          <p>Add Pengadaan</p>
        </Button>
      </div>

      <div className='mt-5 grid grid-cols-2 xl:grid-cols-4 gap-5 justify-between items-center'>
        <StatCard icon={Boxes}  title='Total Pengadaan' value="4"/>
        <StatCard icon={Banknote}  title='Total Spend' value="Rp 955.5K"/>
        <StatCard icon={BanknoteArrowUp}  title='Highest Cost' value="Rp 450K"/>
        <StatCard icon={BanknoteArrowDown}  title='Lowest Cost' value="Rp 50K"/>
        
      </div>

      <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
        <h1 className='font-medium text-xl mb-5'>Pengadaan</h1>

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
      <ProcurementForm show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
