import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatStatusLabel, productStatusColors } from "@/lib/utils";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Product } from "@shared/schema";

interface StatusCardProps {
  requestedCount: number;
  inTransitCount: number;
  delayedCount: number;
  requestedProducts?: Product[];
  inTransitProducts?: Product[];
  delayedProducts?: Product[];
}

const StatusCard = ({
  requestedCount,
  inTransitCount,
  delayedCount,
  requestedProducts = [],
  inTransitProducts = [],
  delayedProducts = []
}: StatusCardProps) => {
  const [activeTab, setActiveTab] = useState<'requested' | 'in_transit' | 'delayed'>('requested');
  
  const pieChartData = [
    { name: 'Requested', value: requestedCount, color: '#0094D6' },
    { name: 'In Transit', value: inTransitCount, color: '#10B981' },
    { name: 'Delayed', value: delayedCount, color: '#F59E0B' }
  ];
  
  const lineChartData = [
    { month: 'Jan', onTime: 25, delayed: 5 },
    { month: 'Feb', onTime: 22, delayed: 8 },
    { month: 'Mar', onTime: 28, delayed: 4 },
    { month: 'Apr', onTime: 30, delayed: 3 },
    { month: 'May', onTime: 26, delayed: 7 },
    { month: 'Jun', onTime: 32, delayed: 6 }
  ];
  
  // Get the current products based on the active tab
  const currentProducts = activeTab === 'requested' 
    ? requestedProducts 
    : activeTab === 'in_transit' 
      ? inTransitProducts 
      : delayedProducts;
  
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">Product Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div 
            onClick={() => setActiveTab('requested')}
            className={cn(
              "bg-blue-50 rounded-lg p-4 text-center cursor-pointer border border-blue-100",
              activeTab === 'requested' && "bg-blue-100"
            )}
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-1">Products Requested</h3>
            <p className="text-3xl font-bold text-blue-800">{requestedCount}</p>
          </div>
          
          <div 
            onClick={() => setActiveTab('in_transit')}
            className={cn(
              "bg-green-50 rounded-lg p-4 text-center cursor-pointer border border-green-100",
              activeTab === 'in_transit' && "bg-green-100"
            )}
          >
            <h3 className="text-lg font-semibold text-green-700 mb-1">In Transit</h3>
            <p className="text-3xl font-bold text-green-800">{inTransitCount}</p>
          </div>
          
          <div 
            onClick={() => setActiveTab('delayed')}
            className={cn(
              "bg-orange-50 rounded-lg p-4 text-center cursor-pointer border border-orange-100",
              activeTab === 'delayed' && "bg-orange-100"
            )}
          >
            <h3 className="text-lg font-semibold text-orange-700 mb-1">Delayed</h3>
            <p className="text-3xl font-bold text-orange-800">{delayedCount}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="onTime" stroke="#10B981" strokeWidth={2} name="On Time" />
                <Line type="monotone" dataKey="delayed" stroke="#F59E0B" strokeWidth={2} name="Delayed" activeDot={{ r: 8 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">
              {formatStatusLabel(activeTab)} Products
            </h3>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('requested')}
                className={activeTab === 'requested' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
              >
                Requested
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('in_transit')}
                className={activeTab === 'in_transit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
              >
                In Transit
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('delayed')}
                className={activeTab === 'delayed' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}
              >
                Delayed
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{product.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">Store #{product.storeId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{product.quantity} cases</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {new Date(product.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <Button size="sm" className="bg-[#0094D6] text-white">
                          Process
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-sm text-gray-500">
                      No products to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
