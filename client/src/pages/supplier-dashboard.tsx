import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import SupplierSidebar from "@/components/supplier/sidebar";
import StatusCard from "@/components/supplier/status-card";
import StoreCard from "@/components/supplier/store-card";
import StoreDetailsModal from "@/components/supplier/store-details-modal";
import ChatList from "@/components/supplier/chat-list";
import { User, Store, Product, Message, Chat } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Package, Truck, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

export default function SupplierDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLocation("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "supplier") {
        setLocation("/");
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLocation("/");
    }
  }, [setLocation]);

  // Fetch supplier stats
  const { data: stats } = useQuery<{
    totalRequestedProducts: number;
    totalInTransitProducts: number;
    totalDelayedProducts: number;
  }>({
    queryKey: ["/api/suppliers/2/stats"],
    enabled: !!user,
  });

  // Fetch stores
  const { data: stores } = useQuery<Store[]>({
    queryKey: ["/api/suppliers/2/stores"],
    enabled: !!user,
  });

  // Fetch products by status
  const { data: requestedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/status/requested", { supplierId: 2 }],
    enabled: !!user,
  });

  const { data: inTransitProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/status/in_transit", { supplierId: 2 }],
    enabled: !!user,
  });

  const { data: delayedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/status/delayed", { supplierId: 2 }],
    enabled: !!user,
  });

  // Fetch chats
  const { data: chats } = useQuery<Chat[]>({
    queryKey: ["/api/suppliers/2/chats"],
    enabled: !!user,
  });

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
    setIsStoreModalOpen(true);
  };

  const handleContactManager = () => {
    toast({
      title: "Chat Opened",
      description: "You can now communicate with the store manager.",
    });
    setIsStoreModalOpen(false);
    // Focus on chat with this manager
    // In a real app, we would find the chat with this manager and select it
  };

  // State for chat messages
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  useEffect(() => {
    // Get the current path to determine which page to show
    const path = window.location.pathname;
    
    if (path.includes("/supplier/stores")) {
      setCurrentPage("stores");
    } else if (path.includes("/supplier/shipments")) {
      setCurrentPage("shipments");
    } else if (path.includes("/supplier/requests")) {
      setCurrentPage("requests");
    } else if (path.includes("/supplier/analytics")) {
      setCurrentPage("analytics");
    } else {
      setCurrentPage("dashboard");
    }
  }, []);

  // Fetch messages for selected chat
  useEffect(() => {
    if (selectedChatId && chats) {
      const chat = chats.find(c => c.id === selectedChatId);
      if (chat) {
        setActiveChat(chat);
        // Fetch messages from the API
        fetch(`/api/chats/${selectedChatId}/messages`)
          .then(res => res.json())
          .then((messages: Message[]) => {
            // Convert string timestamps to Date objects
            const messagesWithDates = messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setChatMessages(messagesWithDates);
          })
          .catch(error => {
            console.error("Error fetching messages:", error);
            toast({
              title: "Error",
              description: "Failed to load messages. Please try again.",
              variant: "destructive"
            });
          });
      }
    }
  }, [selectedChatId, chats, toast]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    const newMsg = {
      chatId: activeChat.id,
      senderId: 2, // Supplier ID
      content: newMessage,
      timestamp: new Date(),
      isRead: false
    };
    
    fetch(`/api/chats/${activeChat.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMsg),
    })
      .then(res => res.json())
      .then(message => {
        // Convert string timestamp to Date object
        const messageWithDate = {
          ...message,
          timestamp: new Date(message.timestamp)
        };
        setChatMessages([...chatMessages, messageWithDate]);
        setNewMessage("");
        
        toast({
          title: "Message Sent",
          description: "Your message has been sent to the store manager.",
        });
      })
      .catch(error => {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Analytics data for charts
  const monthlyDeliveryData = [
    { month: 'Jan', delivered: 152, returned: 12 },
    { month: 'Feb', delivered: 168, returned: 15 },
    { month: 'Mar', delivered: 189, returned: 18 },
    { month: 'Apr', delivered: 201, returned: 14 },
    { month: 'May', delivered: 185, returned: 16 },
    { month: 'Jun', delivered: 210, returned: 19 }
  ];

  const productCategoryData = [
    { name: 'Produce', value: 35, color: '#0094D6' },
    { name: 'Dairy', value: 25, color: '#4C2C92' },
    { name: 'Bakery', value: 18, color: '#10B981' },
    { name: 'Meat', value: 15, color: '#F59E0B' },
    { name: 'Other', value: 7, color: '#6B7280' }
  ];

  const inventoryItems = [
    { id: 1, name: 'Organic Bananas', sku: 'FR-BAN-ORG', category: 'Produce', stock: 1250, reorderLevel: 300, price: 2.99 },
    { id: 2, name: 'Whole Grain Bread', sku: 'BK-BRD-WHL', category: 'Bakery', stock: 450, reorderLevel: 100, price: 4.49 },
    { id: 3, name: 'Organic Milk 1gal', sku: 'DR-MLK-ORG', category: 'Dairy', stock: 680, reorderLevel: 150, price: 5.99 },
    { id: 4, name: 'Fresh Tomatoes', sku: 'FR-TOM-FRS', category: 'Produce', stock: 840, reorderLevel: 200, price: 3.49 },
    { id: 5, name: 'Brown Eggs (12ct)', sku: 'DR-EGG-BRN', category: 'Dairy', stock: 320, reorderLevel: 75, price: 4.99 },
    { id: 6, name: 'Ground Beef 1lb', sku: 'MT-BEF-GRD', category: 'Meat', stock: 520, reorderLevel: 120, price: 7.99 },
    { id: 7, name: 'Organic Spinach', sku: 'FR-SPN-ORG', category: 'Produce', stock: 380, reorderLevel: 90, price: 3.99 },
    { id: 8, name: 'White Rice 5lb', sku: 'GR-RIC-WHT', category: 'Grains', stock: 750, reorderLevel: 100, price: 6.49 }
  ];

  const shipmentItems = [
    { id: 1, trackingId: 'SHP-24051', store: 'Store #1423', products: 18, status: 'In Transit', departureDate: '2023-06-10', estimatedArrival: '2023-06-12' },
    { id: 2, trackingId: 'SHP-24035', store: 'Store #2048', products: 22, status: 'Delivered', departureDate: '2023-06-08', estimatedArrival: '2023-06-09' },
    { id: 3, trackingId: 'SHP-24027', store: 'Store #3476', products: 15, status: 'Delayed', departureDate: '2023-06-07', estimatedArrival: '2023-06-10' },
    { id: 4, trackingId: 'SHP-24020', store: 'Store #5892', products: 20, status: 'Delivered', departureDate: '2023-06-05', estimatedArrival: '2023-06-07' },
    { id: 5, trackingId: 'SHP-24018', store: 'Store #3476', products: 12, status: 'Delivered', departureDate: '2023-06-04', estimatedArrival: '2023-06-06' }
  ];

  const requestItems = [
    { id: 1, requestId: 'REQ-38561', store: 'Store #1423', products: 24, priority: 'High', requestDate: '2023-06-11', deadlineDate: '2023-06-14', status: 'Pending' },
    { id: 2, requestId: 'REQ-38555', store: 'Store #5892', products: 18, priority: 'Medium', requestDate: '2023-06-10', deadlineDate: '2023-06-16', status: 'Approved' },
    { id: 3, requestId: 'REQ-38549', store: 'Store #2048', products: 15, priority: 'Low', requestDate: '2023-06-09', deadlineDate: '2023-06-18', status: 'Processing' },
    { id: 4, requestId: 'REQ-38540', store: 'Store #3476', products: 22, priority: 'High', requestDate: '2023-06-08', deadlineDate: '2023-06-11', status: 'Completed' },
    { id: 5, requestId: 'REQ-38533', store: 'Store #1423', products: 10, priority: 'Medium', requestDate: '2023-06-07', deadlineDate: '2023-06-13', status: 'Completed' }
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  // Get the store manager for the selected store
  const storeManager = selectedStore 
    ? {
        id: 1, // In a real app, get this from the store or a separate API call
        name: "Alex Johnson",
        since: "2019",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      }
    : null;

  // Get products for the selected store
  const storeProducts = selectedStore 
    ? [...(requestedProducts || []), ...(inTransitProducts || []), ...(delayedProducts || [])]
        .filter(p => p.storeId === selectedStore.id)
    : [];

  // Render the content based on the current page
  const renderPageContent = () => {
    switch (currentPage) {
      case "stores":
        return (
          <Card className="bg-white w-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Stores</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Schedule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stores ? (
                      stores.map(store => (
                        <tr key={store.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{store.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.contactPhone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.deliverySchedule}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleStoreClick(store)}>View Details</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading stores...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
        
      case "shipments":
        return (
          <Card className="bg-white w-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipment Tracking</h2>
              
              <div className="mb-6 flex flex-wrap gap-4">
                <Card className="bg-blue-50 border-blue-200 w-full sm:w-auto flex-1">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-4 bg-blue-100 rounded-full p-3">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">In Transit</h3>
                      <p className="text-2xl font-bold text-blue-600">8</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200 w-full sm:w-auto flex-1">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-4 bg-green-100 rounded-full p-3">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Delivered</h3>
                      <p className="text-2xl font-bold text-green-600">42</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-50 border-yellow-200 w-full sm:w-auto flex-1">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-4 bg-yellow-100 rounded-full p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Delayed</h3>
                      <p className="text-2xl font-bold text-yellow-600">3</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Arrival</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipmentItems.map(shipment => (
                      <tr key={shipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shipment.trackingId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.store}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.products}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.departureDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.estimatedArrival}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="ghost" size="sm">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
        
      case "requests":
        return (
          <Card className="bg-white w-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Requests</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requestItems.map(request => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.requestId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.store}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.products}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.deadlineDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            request.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                            request.status === 'Approved' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="ghost" size="sm">Manage</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
        
      case "analytics":
        return (
          <div className="space-y-6 w-full">
            <Card className="bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Performance</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyDeliveryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="delivered" name="Delivered" fill="#0094D6" />
                      <Bar dataKey="returned" name="Returned" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Categories</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          dataKey="value"
                        >
                          {productCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Performing Products</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Organic Bananas</h3>
                        <p className="text-sm text-gray-500">8,245 units sold</p>
                      </div>
                      <span className="text-green-600 font-medium">+24%</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Whole Grain Bread</h3>
                        <p className="text-sm text-gray-500">7,852 units sold</p>
                      </div>
                      <span className="text-green-600 font-medium">+18%</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Organic Milk (1gal)</h3>
                        <p className="text-sm text-gray-500">6,321 units sold</p>
                      </div>
                      <span className="text-green-600 font-medium">+15%</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Fresh Apples (5lb)</h3>
                        <p className="text-sm text-gray-500">5,780 units sold</p>
                      </div>
                      <span className="text-green-600 font-medium">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      default: // Dashboard
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left panel - Store Manager chats */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">Store Managers</h2>
                  {selectedChatId && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm"
                      onClick={() => setSelectedChatId(null)}
                    >
                      Back to list
                    </Button>
                  )}
                </div>
                
                {!selectedChatId ? (
                  <ChatList
                    chats={chats || []}
                    selectedChatId={selectedChatId} 
                    onSelectChat={(chatId) => setSelectedChatId(chatId)}
                  />
                ) : (
                  <div>
                    {activeChat && (
                      <div className="border-b pb-3 mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="Store Manager" />
                            <AvatarFallback>SM</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Store #{activeChat.storeManagerId}</h3>
                            <p className="text-sm text-gray-500">
                              {activeChat.storeManager?.username || "Store Manager"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="chat-messages h-64 overflow-y-auto mb-3 space-y-3">
                      {chatMessages.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex items-start space-x-2 ${
                            message.senderId === 2 ? 'justify-end' : ''
                          }`}
                        >
                          {message.senderId !== 2 && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="Store Manager" />
                              <AvatarFallback>SM</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`p-3 rounded-lg shadow-sm max-w-xs ${
                            message.senderId === 2 
                              ? 'bg-[#0094D6] bg-opacity-10'
                              : 'bg-gray-100'
                          }`}>
                            <p className="text-sm text-gray-700">{message.content}</p>
                            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          </div>
                          {message.senderId === 2 && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://randomuser.me/api/portraits/men/43.jpg" alt="Supplier" />
                              <AvatarFallback>SU</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0094D6] focus:border-transparent"
                        placeholder="Type your message..."
                      />
                      <Button 
                        className="absolute right-3 top-3 text-[#0094D6] p-0 h-auto"
                        variant="ghost"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right side - Visualizations */}
            <div className="md:col-span-2 space-y-6">
              {/* Product Status Visualization */}
              <StatusCard
                requestedCount={stats?.totalRequestedProducts || 0}
                inTransitCount={stats?.totalInTransitProducts || 0}
                delayedCount={stats?.totalDelayedProducts || 0}
                requestedProducts={requestedProducts || []}
                inTransitProducts={inTransitProducts || []}
                delayedProducts={delayedProducts || []}
              />

              {/* Store Cards */}
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Stores</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700">All</Button>
                      <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700">Active</Button>
                      <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700">New Requests</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stores ? (
                      stores.map(store => {
                        // Count products for this store by status
                        const storeRequestedCount = (requestedProducts || []).filter(p => p.storeId === store.id).length;
                        const storeInTransitCount = (inTransitProducts || []).filter(p => p.storeId === store.id).length;
                        const storeDelayedCount = (delayedProducts || []).filter(p => p.storeId === store.id).length;

                        return (
                          <StoreCard
                            key={store.id}
                            store={store}
                            requestedCount={storeRequestedCount}
                            inTransitCount={storeInTransitCount}
                            delayedCount={storeDelayedCount}
                            onClick={() => handleStoreClick(store)}
                          />
                        );
                      })
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        Loading stores...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen grid grid-cols-12">
      {/* Sidebar */}
      <div className="col-span-12 md:col-span-2">
        <SupplierSidebar user={user} />
      </div>

      {/* Main content */}
      <div className="col-span-12 md:col-span-10 bg-gray-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentPage === "dashboard" && "Supplier Dashboard"}
              {currentPage === "stores" && "Store Management"}
              {currentPage === "shipments" && "Shipment Tracking"}
              {currentPage === "requests" && "Store Requests"}
              {currentPage === "analytics" && "Performance Analytics"}
            </h1>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Search className="text-gray-500 h-5 w-5" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">5</span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={user.profileImage || "https://randomuser.me/api/portraits/men/43.jpg"}
                  alt="Supplier"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          {renderPageContent()}
        </div>
      </div>

      {/* Store Details Modal */}
      <StoreDetailsModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        store={selectedStore}
        products={storeProducts}
        manager={storeManager}
        onContactManager={handleContactManager}
      />
    </div>
  );
}
