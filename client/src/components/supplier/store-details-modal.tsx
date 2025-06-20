import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn, formatStatusLabel, productStatusColors } from "@/lib/utils";
import { Store, Product } from "@shared/schema";

interface StoreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
  products: Product[];
  manager: {
    id: number;
    name: string;
    since: string;
    profileImage: string;
  } | null;
  onContactManager: () => void;
}

const StoreDetailsModal = ({
  isOpen,
  onClose,
  store,
  products,
  manager,
  onContactManager,
}: StoreDetailsModalProps) => {
  if (!store) return null;

  const requestedProducts = products.filter(p => p.status === 'requested');
  const inTransitProducts = products.filter(p => p.status === 'in_transit');
  const delayedProducts = products.filter(p => p.status === 'delayed');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl shadow-lg sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex justify-between items-center">
            <span>{store.name}</span>
            <DialogClose className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Store Location</h3>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <img
                src="https://maps.googleapis.com/maps/api/staticmap?center=Dallas,TX&zoom=13&size=600x400&maptype=roadmap&markers=color:red%7C${store.location}"
                alt="Store Map"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x400?text=Map+Unavailable";
                }}
              />
            </div>

            {manager && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Store Manager</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={manager.profileImage}
                    alt="Store Manager"
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/48?text=Manager";
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{manager.name}</h4>
                    <p className="text-sm text-gray-600">Manager since {manager.since}</p>
                    <Button 
                      variant="link" 
                      className="text-[#0094D6] p-0 h-auto text-sm"
                      onClick={onContactManager}
                    >
                      View Chat History
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-3">Product Status</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className={cn("p-3 rounded-lg text-center", productStatusColors.requested.bg)}>
                <div className={cn("text-sm", productStatusColors.requested.text)}>Requested</div>
                <div className={cn("text-2xl font-bold", productStatusColors.requested.text.replace('text', 'text'))}>
                  {requestedProducts.length}
                </div>
              </div>
              <div className={cn("p-3 rounded-lg text-center", productStatusColors.in_transit.bg)}>
                <div className={cn("text-sm", productStatusColors.in_transit.text)}>In Transit</div>
                <div className={cn("text-2xl font-bold", productStatusColors.in_transit.text.replace('text', 'text'))}>
                  {inTransitProducts.length}
                </div>
              </div>
              <div className={cn("p-3 rounded-lg text-center", productStatusColors.delayed.bg)}>
                <div className={cn("text-sm", productStatusColors.delayed.text)}>Delayed</div>
                <div className={cn("text-2xl font-bold", productStatusColors.delayed.text.replace('text', 'text'))}>
                  {delayedProducts.length}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <h3 className="font-medium text-gray-700 mb-3">Latest Products</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.slice(0, 4).map((product) => (
                    <tr key={product.id}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          productStatusColors[product.status as keyof typeof productStatusColors].highlight
                        )}>
                          {formatStatusLabel(product.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.quantity} cases</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                        {product.deliveryDate 
                          ? new Date(product.deliveryDate).toLocaleDateString() 
                          : 'Not scheduled'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Store Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600">Address:</p>
                    <p className="font-medium">{store.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact:</p>
                    <p className="font-medium">{store.contactPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delivery Schedule:</p>
                    <p className="font-medium">{store.deliverySchedule || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Delivery:</p>
                    <p className="font-medium">
                      {store.lastDelivery 
                        ? new Date(store.lastDelivery).toLocaleDateString() 
                        : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-[#0094D6] text-white" onClick={onContactManager}>
            Contact Manager
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreDetailsModal;
