'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatCard } from '@/components/StatCard';
import { columns } from './columns';
import ProcurementForm from './form';
import { DataTable } from './table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Boxes, Banknote, BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';
import { getProcurements } from '@/services/pengadaan/pengadaan.service';
import type { Procurement } from '@/services/pengadaan/pengadaan.service';
import { getLocation } from '@/services/location/location.service';


export default function ProcurementPage() {
  const [showModal, setShowModal] = useState(false);
  const [lokasiFilter, setLokasiFilter] = useState<string | undefined>();
  const [searchFilter, setSearchFilter] = useState('');
  const [recentOrder, setRecentOrder] = useState<'Oldest' | 'Recent'>('Recent');
  const [costOrder, setCostOrder] = useState<'Cost' | 'highest' | 'lowest'>('Cost');

  // Fetch procurements
  const { data, isLoading: isLoadingProcurements } = useQuery({
    queryKey: ['procurements'],
    queryFn: getProcurements,
  });

  // Fetch locations
  const { data: lokasiRes, isLoading: isLoadingLokasi } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocation,
  });

  const lokasiData = lokasiRes?.data ?? [];
  const procurements: Procurement[] = data?.data ?? [];
  const pagination = data?.pagination;

  // Ambil stats dari meta
  const totalPengadaan = data?.meta?.totalPengadaan ?? 0;
  const totalSpend = data?.meta?.totalSpend ?? 0;
  const highestCost = data?.meta?.highestCost?.totalHarga ?? 0;
  const lowestCost = data?.meta?.lowestCost?.totalHarga ?? 0;

  return (
    <div className="text-accent-foreground">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-medium">Pengadaan</h1>
        <Button
          type="button"
          variant="asa"
          onClick={() => setShowModal(true)}
          className="flex justify-center items-center"
        >
          <Plus className="mr-1" size={20} />
          <p>Add Pengadaan</p>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="mt-5 grid grid-cols-2 xl:grid-cols-4 gap-5 justify-between items-center">
        <StatCard icon={Boxes} title="Total Pengadaan" value={totalPengadaan.toString()} />
        <StatCard icon={Banknote} title="Total Spend" value={`Rp ${totalSpend.toLocaleString()}`} />
        <StatCard icon={BanknoteArrowUp} title="Highest Cost" value={`Rp ${highestCost.toLocaleString()}`} />
        <StatCard icon={BanknoteArrowDown} title="Lowest Cost" value={`Rp ${lowestCost.toLocaleString()}`} />
      </div>

      {/* Data Table */}
      <div className="w-full p-5 bg-sidebar border rounded-sm mt-5">
        <h1 className="font-medium text-xl mb-5">Daftar Pengadaan</h1>
        <DataTable
          columns={columns}
          data={procurements}
          lokasiData={lokasiData}
          pagination={pagination}
          isLoading={isLoadingProcurements || isLoadingLokasi}
          lokasiFilter={lokasiFilter}
          setLokasiFilter={setLokasiFilter}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          recentOrder={recentOrder}
          setRecentOrder={setRecentOrder}
          costOrder={costOrder}
          setCostOrder={setCostOrder}
        />
      </div>

      {/* Modal Form */}
      <ProcurementForm show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
