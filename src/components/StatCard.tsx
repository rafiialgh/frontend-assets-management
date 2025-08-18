// components/StatCard.tsx
import React from "react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value }) => {
  return (
    <div className="flex justify-between bg-sidebar border rounded-sm items-center w-full h-[95px] px-4 hover:bg-gray-100 hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-2">
        <Icon size={35} className="text-gray-400"/>
      </div>
      <div>
        <p className="text-right">{title}</p>
        <p className="text-2xl text-right">{value}</p>
      </div>
    </div>
  );
};
