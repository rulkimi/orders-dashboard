"use client";

import { useState, useEffect } from "react";
import DashboardCard, { DashboardCardItem } from "@/app/dashboard/dashboard-card";
import { Order, columns } from "@/app/orders/columns";
import { DataTable } from "@/app/orders/data-table";
import { getData } from "@/app/orders/page";
import FakeChart from "@/app/dashboard/fake-chart";

async function getInfo(): Promise<DashboardCardItem[]> {
  const response = await fetch("http://localhost:8000/info");

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const info: DashboardCardItem[] = await response.json();
  return info;
}

export default function Dashboard() {
  const [dashboardCardItems, setDashboardCardItems] = useState<DashboardCardItem[]>([]);
  const [tableData, setTableData] = useState<Order[]>([]);
  const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
  const [renderFakeChart, setRenderFakeChart] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardItems = await getInfo();
        const orders = await getData();

        setDashboardCardItems(dashboardItems);
        setTableData(orders);
        setIsDataUpdated(true);
        
        setTimeout(() => {
          setRenderFakeChart(true);
        }, 50);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-12">
      <ul className="grid grid-cols-12 gap-4 mb-4">
        {dashboardCardItems.map((cardItem, index) => (
          <DashboardCard
            key={index}
            className="col-span-12 md:col-span-6 lg:col-span-3"
            item={cardItem}
          />
        ))}
      </ul>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full h-[615px] lg:w-1/2">
          {isDataUpdated && renderFakeChart && <FakeChart />}
        </div>

        <div className="w-full lg:w-1/2">
          {isDataUpdated && <DataTable columns={columns} data={tableData} isDashboard />}
        </div>
      </div>
    </div>
  );
}
