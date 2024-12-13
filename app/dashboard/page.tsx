import DashboardCard from "@/components/DashboardCard"
import { DashboardCardItem } from "@/components/DashboardCard"

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
  
  return (
    <div>
      <ul className="grid grid-cols-12 gap-4">
        {dashboardCardItems.map((cardItem, index) => (
          <DashboardCard
            className="col-span-12 md:col-span-6 lg:col-span-3" key={index} item={cardItem}
          />
        ))}
      </ul>
    </div>
  )
}
