import { cn, productStatusColors } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Store } from "@shared/schema";

interface StoreCardProps {
  store: Store;
  requestedCount: number;
  inTransitCount: number;
  delayedCount: number;
  onClick: () => void;
}

const StoreCard = ({
  store,
  requestedCount,
  inTransitCount,
  delayedCount,
  onClick,
}: StoreCardProps) => {
  const isActive = requestedCount > 0 || inTransitCount > 0 || delayedCount > 0;
  const hasNewRequest = requestedCount > 0;

  return (
    <Card 
      className="store-card bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-800">{store.name}</h3>
          <p className="text-sm text-gray-600">{store.location}</p>
        </div>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full",
          hasNewRequest ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        )}>
          {hasNewRequest ? "New Request" : "Active"}
        </span>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <div>Last Order: <span className="font-medium">
          {store.lastDelivery ? new Date(store.lastDelivery).toLocaleDateString() : 'None'}
        </span></div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className={cn("p-2 rounded text-center", productStatusColors.requested.bg)}>
          <div className={cn("text-xs", productStatusColors.requested.text)}>Requested</div>
          <div className={cn("font-medium", productStatusColors.requested.text.replace('text', 'text'))}>
            {requestedCount}
          </div>
        </div>
        <div className={cn("p-2 rounded text-center", productStatusColors.in_transit.bg)}>
          <div className={cn("text-xs", productStatusColors.in_transit.text)}>In Transit</div>
          <div className={cn("font-medium", productStatusColors.in_transit.text.replace('text', 'text'))}>
            {inTransitCount}
          </div>
        </div>
        <div className={cn("p-2 rounded text-center", productStatusColors.delayed.bg)}>
          <div className={cn("text-xs", productStatusColors.delayed.text)}>Delayed</div>
          <div className={cn("font-medium", productStatusColors.delayed.text.replace('text', 'text'))}>
            {delayedCount}
          </div>
        </div>
      </div>

      <div className="text-[#0094D6] text-sm font-medium text-right">
        View Details →
      </div>
    </Card>
  );
};

export default StoreCard;
