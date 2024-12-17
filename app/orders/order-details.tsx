import { Button } from "@/components/ui/button"
import { Image } from "lucide-react"

export interface OrderDetailsProps {
  onClose: () => void
  details: {
    id: string
    items: Array<{
      name: string
      price: number
      expiry: string
      amount: number
    }>
    payment_method: string
    pickup_time: string
    subtotal: number
    service_tax: number
    voucher_applied: number
  },
  tableHeight: number
}

export type OrderDetailsType = OrderDetailsProps["details"]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(price)
}

export default function OrderDetails({ onClose, details, tableHeight }: OrderDetailsProps) {
  const containerStyle = { maxHeight: tableHeight - 7.5 + 'px' }

  return (
    <div className="px-2 pt-2 mb-2 flex flex-col overflow-y-auto" style={containerStyle}>
      <div className="text-end">
        <Button variant="outline" className="text-gray-500" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="px-4 overflow-y-auto max-h-full">
        <div className="font-bold text-2xl">Order Details</div>

        <div className="flex flex-col py-3 border-b">
          <span className="font-bold">Payment method</span>
          <span>{details.payment_method}</span>
        </div>

        <div className="flex flex-col py-3">
          <span className="font-bold">Pickup time</span>
          <span>{details.pickup_time}</span>
        </div>

        <div>
          <div className="font-bold text-2xl">Items</div>
          {details.items.map((item, index) => (
            <div
              key={item.name}
              className={`flex gap-4 py-5 ${index + 1 !== details.items.length ? 'border-b' : ''}`}
            >
              <div className="flex items-center">{item.amount}x</div>
              <div className="flex w-full items-center gap-2">
                <Image className="text-gray-400" size={80} />
                <div className="flex flex-col w-full">
                  <div>{item.name}</div>
                  <div className="flex w-full justify-between">
                    <span className="text-gray-500">{item.expiry} from expiry date</span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 px-8 py-2 rounded-sm">
          <div className="py-2 border-b border-white flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(details.subtotal)}</span>
          </div>
          <div className="py-2 border-b border-white flex justify-between">
            <span>Service Tax</span>
            <span>{formatPrice(details.service_tax)}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span>Voucher applied</span>
            <span>- {formatPrice(details.voucher_applied)}</span>
          </div>
        </div>

        <div className="bg-gray-100 px-8 py-2 rounded-sm mt-6">
          10% voucher applied
        </div>
      </div>
    </div>
  )
}
