import DashboardCard from "@/components/DashboardCard"

export default function Dashboard() {
  const dashboardCardItems = [
    { title: 'Total Revenue', value: '$115,237', detail: 'From last month' },
    { title: 'Total new user', value: '+20', detail: 'From last month' },
    { title: 'Total new merchant', value: '+3', detail: 'From last month' },
    { title: 'Total active user', value: '+250', detail: 'Currently' },
  ]
  
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
