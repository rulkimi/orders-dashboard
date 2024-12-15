import DashboardCard from "@/components/DashboardCard"
import { DashboardCardItem } from "@/components/DashboardCard"
import { Order, columns } from "@/app/orders/columns";
import { DataTable } from "@/app/orders/data-table";
import { getData } from "../orders/page";
import FakeChart from "./fake-chart";

async function getInfo(): Promise<DashboardCardItem[]> {
  const response = await fetch('http://localhost:8000/info')

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const info: DashboardCardItem[] = await response.json();
  return info;
}

export default async function Dashboard() {
  const dashboardCardItems = await getInfo();
  const tableData = await getData();
  
  return (
    <div>
      <ul className="grid grid-cols-12 gap-4 mb-4">
        {dashboardCardItems.map((cardItem, index) => (
          <DashboardCard
            className="col-span-12 md:col-span-6 lg:col-span-3" key={index} item={cardItem}
          />
        ))}
      </ul>
      <div className="flex gap-4">
        <div className="w-1/2">
          <FakeChart />
        </div>
        <div className="w-1/2">
          <DataTable columns={columns} data={tableData} isDashboard />
        </div>
      </div>
    </div>
  )
}
