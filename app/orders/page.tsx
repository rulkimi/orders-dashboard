import { Order, columns } from "@/app/orders/columns";
import { DataTable } from "@/app/orders/data-table";
import Link from "next/link";

export async function getData(): Promise<Order[]> {
  const response = await fetch('http://localhost:8000/orders');
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data: Order[] = await response.json();
  return data;
}

export default async function Orders() {
  const data = await getData();

  return (
    <div className="container mx-auto">
      <div className="flex gap-4 mb-4 text-gray-500">
        <Link href="/dashboard">Dashboard</Link>
        <div className="font-bold text-black border-b-2 border-black">Sales Orders</div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
);
}
 