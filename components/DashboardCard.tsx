interface DashboardCardProps {
  item: {
    title: string
    value: string
    detail: string
  },
  className?: string
}

export default function DashboardCard({ item, className }: DashboardCardProps) {

  return (
    <div className={`${className} bg-gradient-to-b from-emerald-950 to-emerald-700 p-4 flex flex-col gap-1 rounded-xl w-full`}>
      <span className="text-emerald-300 font-semibold">{item.title}</span>
      <span className="text-white font-bold text-4xl">{item.value}</span>
      <span className="text-white">{item.detail}</span>
    </div>
  )
}