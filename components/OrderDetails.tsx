import { Button } from "./ui/button"

export default function OrderDetail({ onClose }: {onClose: ()=> void}) {
  return (
    <div className="p-2 text-end">
      <Button
        variant="outline"
        className="text-gray-500"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  )
}
