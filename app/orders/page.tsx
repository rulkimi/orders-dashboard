import { Order, columns } from "@/app/orders/columns";
import { DataTable } from "@/app/orders/data-table";

async function getData(): Promise<Order[]> {
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
      <DataTable columns={columns} data={data} />
    </div>
  );
}
