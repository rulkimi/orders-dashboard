import { Order, columns } from "@/app/orders/columns";
import { DataTable } from "@/app/orders/data-table";

async function getData(): Promise<Order[]> {
  return [
    {
      id: "RSQ0060",
      buyer: "Daniel Altaf Hasnan",
      merchant: "MBG Fruit Shop Mid Valley Megamal",
      status: "preparing",
      date: "4-06-24 20.00",
      amount: 50
    },
    {
      id: "RSQ0059",
      buyer: "Umendran",
      merchant: "E mart Mid Valley Megamal",
      status: "preparing",
      date: "4-06-24 20.00",
      amount: 45
    },
    {
      id: "RSQ0058",
      buyer: "Nabila Abd Rahim",
      merchant: "Kedai kopi Malaya Megamal",
      status: "waitpickup",
      date: "4-06-24 20.00",
      amount: 30
    },
    {
      id: "RSQ0057",
      buyer: "Siti Aisyah Zukri",
      merchant: "Oriental Kopi Mid Valley Megamal",
      status: "cancel",
      date: "4-06-24 20.00",
      amount: 20
    },
    {
      id: "RSQ0056",
      buyer: "DS Mike Chan",
      merchant: "MBG Fruit Shop Mid Valley Megamal",
      status: "pending",
      date: "4-06-24 20.00",
      amount: 35
    },
    {
      id: "RSQ0055",
      buyer: "Brendan Khoo",
      merchant: "E mart Mid Valley Megamal",
      status: "refund",
      date: "4-06-24 20.00",
      amount: 25
    },
    {
      id: "RSQ0054",
      buyer: "Peei Yeek",
      merchant: "Kedai kopi Malaya Megamal",
      status: "completed",
      date: "4-06-24 20.00",
      amount: 40
    },
    {
      id: "RSQ0053",
      buyer: "Nuruddin Zaim",
      merchant: "Oriental Kopi Mid Valley Megamal",
      status: "nopickup",
      date: "4-06-24 20.00",
      amount: 15
    },
    {
      id: "RSQ0052",
      buyer: "Mohd Zulfiqar",
      merchant: "MBG Fruit Shop Mid Valley Megamal",
      status: "completed",
      date: "4-06-24 20.00",
      amount: 60
    },
    {
      id: "RSQ0051",
      buyer: "Mohd Zulfiqar",
      merchant: "MBG Fruit Shop Mid Valley Megamal",
      status: "completed",
      date: "4-06-24 20.00",
      amount: 60
    }
  ];
}

export default async function Orders() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

