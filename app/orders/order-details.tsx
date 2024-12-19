import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  tableHeight: number,
  setData: () => void
}

export type OrderDetailsType = OrderDetailsProps["details"]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(price)
}

export default function OrderDetails({ onClose, details, tableHeight, setData }: OrderDetailsProps) {
  const containerStyle = { maxHeight: tableHeight - 7.5 + 'px' }

  const [isEditingPaymentMethod, setIsEditingPaymentMethod] = useState(false)
  const [isEditingPickupTime, setIsEditingPickupTime] = useState(false)

  const [newPaymentMethod, setNewPaymentMethod] = useState(details.payment_method)
  const [newPickupTime, setNewPickupTime] = useState(details.pickup_time)

  const { toast } = useToast()

  const handleSave = async () => {
    try {
      setIsEditingPaymentMethod(false);
      setIsEditingPickupTime(false);
  
      const updatedOrder = {
        pickup_time: newPickupTime,
        payment_method: newPaymentMethod
      };
  
      const response = await fetch(`http://localhost:8000/order_details/${details.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder)
      });

      if (!response.ok) {
        throw new Error(`Failed to update order with ID ${details.id}`);
      }

      setData();
      toast({ description: 'Order details updated.' })
  
      const data = await response.json();
    } catch (error) {
      console.error('Error updating the order:', error);
    }
  };
  

  const handleCancel = () => {
    setNewPaymentMethod(details.payment_method)
    setNewPickupTime(details.pickup_time)
    setIsEditingPaymentMethod(false)
    setIsEditingPickupTime(false)
  }

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
          {isEditingPaymentMethod ? (
            <div className="flex gap-2">
              <Input
                id="payment-method"
                type="text"
                value={newPaymentMethod}
                onChange={(e) => setNewPaymentMethod(e.target.value)}
                className="px-2 py-1"
              />
              <Button variant="outline" onClick={handleSave}>Save</Button>
              <Button variant="outline" className="text-gray-500" onClick={handleCancel}>Cancel</Button>
            </div>
          ) : (
            <div className="flex justify-between">
              <span>{details.payment_method}</span>
              <Button variant="outline" className="text-blue-500" onClick={() => setIsEditingPaymentMethod(true)}>
                Edit
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col py-3">
          <span className="font-bold">Pickup time</span>
          {isEditingPickupTime ? (
            <div className="flex gap-2">
              <Input
                id="pickup-time"
                type="text"
                value={newPickupTime}
                onChange={(e) => setNewPickupTime(e.target.value)}
                className="px-2 py-1"
              />
              <Button variant="outline" onClick={handleSave}>Save</Button>
              <Button variant="outline" className="text-gray-500" onClick={handleCancel}>Cancel</Button>
            </div>
          ) : (
            <div className="flex justify-between">
              <span>{details.pickup_time}</span>
              <Button variant="outline" className="text-blue-500" onClick={() => setIsEditingPickupTime(true)}>
                Edit
              </Button>
            </div>
          )}
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
