import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import StoreManagerSidebar from "@/components/store-manager/sidebar";
import NotifyPanel from "@/components/store-manager/notify-panel";
import FilterPanel from "@/components/store-manager/filter-panel";
import AiPanel from "@/components/store-manager/ai-panel";
import StatsCard from "@/components/store-manager/stats-card";
import { User } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Bell, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Chat {
  id: number;
  supplierId: number;
  storeManagerId: number;
  lastMessageTime: Date;
  unreadCount: number;
  companyName: string;
  supplierImage: string;
  supplier?: {
    id: number;
    username: string;
    companyName: string;
    profileImage: string;
  };
}

interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Stats {
  totalSales: number;
  inventoryValue: number;
  wasteValue: number;
  activeSupplierOrders: number;
}

interface ApiChat {
  id: number;
  supplierId: number;
  storeManagerId: number;
  lastMessageTime: string;
  unreadCount: number;
  supplier?: {
    id: number;
    username: string;
    companyName: string;
    profileImage: string;
  };
}

interface ApiMessage {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Supplier {
  id: number;
  username: string;
  companyName: string;
  profileImage: string;
  productCount?: number;
  status?: string;
  lastOrder?: string;
}

export default function StoreManagerDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'notify' | 'filter' | 'ai'>('dashboard');
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLocation("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "storeManager") {
        setLocation("/");
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLocation("/");
    }
  }, [setLocation]);

  // Get current page from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/store-manager/suppliers")) {
      setCurrentPage("suppliers");
    } else {
      setCurrentPage("dashboard");
    }
  }, []);

    // Dummy suppliers data for suppliers page
    const suppliersData = [
      { 
        id: 1, 
        name: "Fresh Farms Produce", 
        categories: ["Produce", "Organic"], 
        rating: 4.8,
        orders: 342,
        onTime: 98,
        logoUrl: "https://randomuser.me/api/portraits/men/43.jpg",
        contactEmail: "orders@freshfarms.com",
        contactPhone: "555-123-4567",
        description: "Specializing in fresh, locally-sourced produce with next-day delivery options",
        products: [
          { name: "Organic Bananas", category: "Produce", price: 1.99, inventory: 450 },
          { name: "Fresh Tomatoes", category: "Produce", price: 2.49, inventory: 320 },
          { name: "Organic Kale", category: "Produce", price: 3.99, inventory: 180 },
          { name: "Mixed Berries", category: "Produce", price: 4.99, inventory: 250 }
        ],
        performanceData: [
          { month: "Jan", orders: 38, onTime: 36 },
          { month: "Feb", orders: 42, onTime: 41 },
          { month: "Mar", orders: 31, onTime: 30 },
          { month: "Apr", orders: 45, onTime: 44 },
          { month: "May", orders: 51, onTime: 49 },
          { month: "Jun", orders: 47, onTime: 46 }
        ]
      },
      { 
        id: 2, 
        name: "Dairy Delights Inc", 
        categories: ["Dairy", "Refrigerated"], 
        rating: 4.5,
        orders: 287,
        onTime: 94,
        logoUrl: "https://randomuser.me/api/portraits/women/65.jpg",
        contactEmail: "orders@dairydelights.com",
        contactPhone: "555-444-5678",
        description: "Premium dairy products with focus on sustainable and ethical farming practices",
        products: [
          { name: "Organic Milk 1gal", category: "Dairy", price: 5.99, inventory: 320 },
          { name: "Greek Yogurt", category: "Dairy", price: 3.79, inventory: 280 },
          { name: "Cheddar Cheese", category: "Dairy", price: 4.59, inventory: 190 },
          { name: "Butter Sticks", category: "Dairy", price: 2.99, inventory: 230 }
        ],
        performanceData: [
          { month: "Jan", orders: 31, onTime: 29 },
          { month: "Feb", orders: 35, onTime: 32 },
          { month: "Mar", orders: 40, onTime: 38 },
          { month: "Apr", orders: 36, onTime: 34 },
          { month: "May", orders: 42, onTime: 40 },
          { month: "Jun", orders: 38, onTime: 37 }
        ]
      },
      { 
        id: 3, 
        name: "Baker's Best", 
        categories: ["Bakery", "Organic"], 
        rating: 4.7,
        orders: 325,
        onTime: 96,
        logoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
        contactEmail: "orders@bakersbest.com",
        contactPhone: "555-987-6543",
        description: "Artisanal bakery products featuring traditional recipes and organic ingredients",
        products: [
          { name: "Whole Grain Bread", category: "Bakery", price: 4.49, inventory: 250 },
          { name: "Croissants (4pk)", category: "Bakery", price: 5.99, inventory: 180 },
          { name: "Dinner Rolls", category: "Bakery", price: 3.49, inventory: 220 },
          { name: "Baguettes", category: "Bakery", price: 2.99, inventory: 160 }
        ],
        performanceData: [
          { month: "Jan", orders: 42, onTime: 40 },
          { month: "Feb", orders: 38, onTime: 37 },
          { month: "Mar", orders: 45, onTime: 43 },
          { month: "Apr", orders: 50, onTime: 48 },
          { month: "May", orders: 47, onTime: 45 },
          { month: "Jun", orders: 52, onTime: 50 }
        ]
      },
      { 
        id: 4, 
        name: "Prime Meats & Seafood", 
        categories: ["Meat", "Seafood", "Refrigerated"], 
        rating: 4.9,
        orders: 289,
        onTime: 99,
        logoUrl: "https://randomuser.me/api/portraits/men/54.jpg",
        contactEmail: "orders@primemeats.com",
        contactPhone: "555-333-2222",
        description: "Premium quality meat and seafood specializing in responsibly sourced products",
        products: [
          { name: "Ground Beef 1lb", category: "Meat", price: 7.99, inventory: 120 },
          { name: "Chicken Breast", category: "Meat", price: 8.99, inventory: 110 },
          { name: "Atlantic Salmon", category: "Seafood", price: 12.99, inventory: 90 },
          { name: "Premium Steaks", category: "Meat", price: 18.99, inventory: 80 }
        ],
        performanceData: [
          { month: "Jan", orders: 32, onTime: 32 },
          { month: "Feb", orders: 36, onTime: 36 },
          { month: "Mar", orders: 30, onTime: 29 },
          { month: "Apr", orders: 42, onTime: 42 },
          { month: "May", orders: 38, onTime: 38 },
          { month: "Jun", orders: 44, onTime: 43 }
        ]
      }
    ];

  // Dummy chat messages for improved notify panel
  const dummyChatMessages = {
    1: [
      {
        id: 1,
        chatId: 1,
        senderId: 2, // Supplier
        content: "We'll need to delay the produce delivery due to transportation issues. Can we reschedule for tomorrow?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false
      },
      {
        id: 2,
        chatId: 1,
        senderId: 1, // Store Manager
        content: "That's very short notice. We're running low on several produce items already.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isRead: true
      },
      {
        id: 3,
        chatId: 1,
        senderId: 2, // Supplier
        content: "I understand. We can dispatch a partial order with the critical items today if that helps?",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false
      }
    ],
    2: [
      {
        id: 1,
        chatId: 2,
        senderId: 2, // Supplier
        content: "Just confirming your dairy order for tomorrow. Any changes needed?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 2,
        chatId: 2,
        senderId: 1, // Store Manager
        content: "Could we increase the yogurt quantity by 20%? We have a promotion starting.",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 3,
        chatId: 2,
        senderId: 2, // Supplier
        content: "No problem, order updated. Anything else?",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: true
      }
    ],
    3: [
      {
        id: 1,
        chatId: 3,
        senderId: 1, // Store Manager
        content: "Do you have any seasonal items available for our fall promotion?",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 2,
        chatId: 3,
        senderId: 3, // Supplier
        content: "Yes! We have pumpkin bread, apple pastries, and cinnamon rolls. I'll send a catalog.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true
      }
    ]
  };

  // Fetch chats
  const { data: chats } = useQuery<ApiChat[], Error, Chat[]>({
    queryKey: ["/api/store-managers/" + (user?.id || 1) + "/chats"],
    enabled: !!user && activeSection === 'notify',
    select: (data: ApiChat[]) => {
      if (!Array.isArray(data)) return [];
      return data.map((chat) => ({
        ...chat,
        companyName: chat.supplier?.companyName || 'Unknown Supplier',
        supplierImage: chat.supplier?.profileImage || `https://randomuser.me/api/portraits/men/${chat.supplierId}.jpg`,
        lastMessageTime: new Date(chat.lastMessageTime)
      })) as Chat[];
    }
  });

  // Fetch messages for selected chat
  const { data: messages } = useQuery<ApiMessage[], Error, Message[]>({
    queryKey: ["/api/chats/" + (selectedChat?.id || 0) + "/messages"],
    enabled: !!selectedChat,
    select: (data: ApiMessage[]) => {
      if (!Array.isArray(data)) return [];
      return data.map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp)
      })) as Message[];
    }
  });

  // Fetch store manager stats
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/store-managers/" + (user?.id || 1) + "/stats"],
    enabled: !!user,
  });

  // Fetch sales by category
  const { data: salesByCategory } = useQuery({
    queryKey: ["/api/stores/1/sales/by-category"],
    enabled: !!user,
  });

  // Fetch waste data
  const { data: wasteData } = useQuery({
    queryKey: ["/api/stores/1/waste"],
    enabled: !!user,
  });

  // Fetch suppliers
  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["/api/stores/" + (user?.storeId || 1) + "/suppliers"],
    enabled: !!user && currentPage === "suppliers",
  });

  const handleSendMessage = (chatId: number, content: string) => {
    // In a real app, this would make an API call to send the message
    toast({
      title: "Message Sent",
      description: `Message "${content}" sent to chat #${chatId}`,
    });
  };

  const handleSectionChange = (section: 'notify' | 'filter' | 'ai') => {
    setActiveSection(section);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Prepare chart data
  const categorySalesData = salesByCategory
    ? (salesByCategory as any[]).map((item: any, index: number) => ({
        name: item.category,
        value: item.amount,
        color: [
          "#0071DC", "#4C2C92", "#10B981", "#F59E0B", "#EF4444", "#6B7280"
        ][index % 6]
      }))
    : [];

  const wasteChartData = wasteData
    ? (wasteData as any[]).map((item: any) => ({
        month: item.month,
        waste: item.amount
      }))
    : [];

  return (
    <div className="h-screen grid grid-cols-12">
      {/* Sidebar */}
      <div className="col-span-12 md:col-span-2">
        <StoreManagerSidebar 
          user={user} 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* Main content */}
      <div className="col-span-12 md:col-span-10 bg-gray-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentPage === "dashboard" ? "Store Manager Dashboard" : "Suppliers"}
            </h1>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Search className="text-gray-500 h-5 w-5" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm relative">
                <Bell className="text-gray-500 h-5 w-5" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={user.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt="Store Manager"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              </div>
            </div>
          </div>
          
          {/* Page content */}
          {currentPage === "suppliers" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Suppliers</h3>
                    <p className="text-3xl font-bold text-[#4C2C92]">12</p>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Orders</h3>
                    <p className="text-3xl font-bold text-[#4C2C92]">8</p>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Products</h3>
                    <p className="text-3xl font-bold text-[#4C2C92]">156</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">All Suppliers</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700">All</Button>
                      <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700">Active</Button>
                      <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700">New</Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {suppliers ? (
                          suppliers.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    src={supplier.profileImage || `https://randomuser.me/api/portraits/men/${supplier.id}.jpg`}
                                    alt={supplier.username}
                                    className="w-8 h-8 rounded-full mr-3"
                                  />
                                  <span className="text-sm font-medium text-gray-900">{supplier.username}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.companyName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.productCount || 0}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  supplier.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  supplier.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {supplier.status || 'Active'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier.lastOrder ? new Date(supplier.lastOrder).toLocaleDateString() : 'Never'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button variant="ghost" size="sm" className="text-[#4C2C92]">View Details</Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading suppliers...</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Charts Section when dashboard is active */}
              {activeSection === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Category Sales</h2>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categorySalesData}
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={1}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categorySalesData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Waste Production (Monthly)</h2>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={wasteChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, 'Waste Value']} />
                          <Line 
                            type="monotone" 
                            dataKey="waste" 
                            stroke="#EF4444" 
                            strokeWidth={3}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dashboard Sections (Notify, Filter, AI) */}
              <div className="dashboard-sections">
                {activeSection === 'notify' && (
                  <NotifyPanel 
                    chats={chats || []}
                    selectedChat={selectedChat}
                    messages={messages || []}
                    currentUserId={user.id}
                    onSelectChat={setSelectedChat}
                    onSendMessage={handleSendMessage}
                  />
                )}
                
                {activeSection === 'filter' && (
                  <FilterPanel />
                )}
                
                {activeSection === 'ai' && (
                  <AiPanel />
                )}
              </div>
              
              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Sales"
                  value={stats?.totalSales || 0}
                  previousValue={(stats?.totalSales || 0) * 0.92} // Mocked previous value for demo
                  suffix="$"
                  info="last month"
                />
                
                <StatsCard
                  title="Inventory Value"
                  value={stats?.inventoryValue || 0}
                  previousValue={(stats?.inventoryValue || 0) * 1.024} // Mocked previous value for demo
                  suffix="$"
                  info="last month"
                />
                
                <StatsCard
                  title="Waste Value"
                  value={stats?.wasteValue || 0}
                  previousValue={(stats?.wasteValue || 0) * 0.982} // Mocked previous value for demo
                  suffix="$"
                  info="last month"
                />
                
                <StatsCard
                  title="Active Supplier Orders"
                  value={stats?.activeSupplierOrders || 0}
                  previousValue={(stats?.activeSupplierOrders || 0) - 12} // Mocked previous value for demo
                  info="18 on schedule, 10 delayed"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
