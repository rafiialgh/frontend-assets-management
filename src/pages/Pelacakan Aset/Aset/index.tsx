import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Boxes, CircleDotDashed, Plus, SquareStack } from 'lucide-react';
import { useState } from 'react';
import { AssetTable } from './table';
import { columns } from './columns';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssets } from '@/services/asset/asset.service';
import { useDebounce } from '@/hooks/useDebounce';
import { getDropdown } from '@/services/global/global.service';

export default function Aset() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>('');
  const [recentFilter, setRecentFilter] = useState<string | undefined>(
    undefined
  );
  const [locationFilter, setLocationFilter] = useState<string | undefined>(
    undefined
  );
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined
  );
  const [conditionFilter, setConditionFilter] = useState<string | undefined>(
    undefined
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const debouncedSearch = useDebounce(search, 500);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: [
      'assets',
      categoryFilter,
      statusFilter,
      conditionFilter,
      recentFilter,
      locationFilter,
      debouncedSearch,
      page,
      limit,
    ],
    queryFn: () =>
      getAssets({
        kategori: categoryFilter,
        status: statusFilter,
        kondisi: conditionFilter,
        recent: recentFilter,
        lokasi: locationFilter,
        search: debouncedSearch,
        page,
        limit,
      }),
  });

  const { data: dropdown } = useQuery({
    queryKey: ['dropdown'],
    queryFn: () => getDropdown(),
  });

  console.log(dropdown);

  const assets = data?.data ?? [];
  console.log(assets);
  const pagination = data?.pagination;
  const summary = data?.summary;

  const handleSearchChange = (value: string) => {
    setPage(1); // Reset halaman ke 1 setiap kali pencarian dimulai
    setSearch(value);
  };

  const handleLocationChange = (value: string | undefined) => {
    setPage(1);
    setLocationFilter(value);
  };

  const handleCategoryChange = (value: string | undefined) => {
    setPage(1);
    setCategoryFilter(value);
  };

  const handleStatusChange = (value: string | undefined) => {
    setPage(1);
    setStatusFilter(value);
  };

  const handleConditionChange = (value: string | undefined) => {
    setPage(1);
    setConditionFilter(value);
  };

  const handleRecentChange = (value: string | undefined) => {
    setPage(1);
    setRecentFilter(value);
  };

  return (
    <div className='text-accent-foreground'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-medium'>Aset</h1>
        <Link to={'/aset/tambah'}>
          <Button
            type='button'
            variant={'asa'}
            className='flex justify-center items-center'
          >
            <Plus className='mr-1' size={20} />
            <p>Add Asset</p>
          </Button>
        </Link>
      </div>

      <div className='mt-5 grid grid-cols-2 xl:grid-cols-4 gap-5 justify-between items-center'>
        <StatCard
          icon={Boxes}
          title='Total Aset'
          value={summary?.totalAset ?? 0}
        />
        <StatCard
          icon={SquareStack}
          title='Kategori Aset'
          value={summary?.totalKategori ?? 0}
        />
        <div className='flex justify-between bg-sidebar border rounded-sm items-center w-full h-[95px] px-4 hover:bg-gray-100 hover:-translate-y-0.5 transition-all col-span-2'>
          <div className='flex items-center gap-2'>
            <CircleDotDashed size={35} className='text-gray-400' />
          </div>
          <div>
            <Badge variant={'active'}>Aktif</Badge>
            <p className='text-2xl text-right'>
              {summary?.totalStatusAktif ?? 0}
            </p>
          </div>
          <div>
            <Badge variant={'nonactive'}>Nonaktif</Badge>
            <p className='text-2xl text-right'>
              {summary?.totalStatusNonaktif ?? 0}
            </p>
          </div>
          <div>
            <Badge variant={'maintenanceOutline'}>Maintenance</Badge>
            <p className='text-2xl text-right'>
              {summary?.totalStatusMaintenance}
            </p>
          </div>
        </div>
      </div>

      <div className='w-full p-5 bg-sidebar border rounded-sm mt-5'>
        <h1 className='font-medium text-xl mb-5'>Assets</h1>

        <AssetTable
          columns={columns}
          data={assets}
          pagination={pagination}
          dropdown={dropdown?.data}
          recentFilter={recentFilter}
          setRecentFilter={handleRecentChange}
          searchFilter={search}
          setSearchFilter={handleSearchChange}
          locationFilter={locationFilter}
          setLocationFilter={handleLocationChange}
          categoryFilter={categoryFilter}
          setCategoryFilter={handleCategoryChange}
          conditionFilter={conditionFilter}
          setConditionFilter={handleConditionChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
        />
      </div>
      
    </div>
  );
}
