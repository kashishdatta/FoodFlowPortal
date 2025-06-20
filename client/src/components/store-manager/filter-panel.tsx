import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Default data states for filtered sales by category
const defaultSalesData = [
  { category: 'Food', sales: 12500 },
  { category: 'Bakery', sales: 8900 },
  { category: 'Dairy', sales: 6700 },
  { category: 'Produce', sales: 5500 },
  { category: 'Meat', sales: 4500 }
];

// Default data for top performing products
const defaultProductsData = [
  { 
    id: 1,
    product: 'Fresh Organic Bananas', 
    sales: 12450, 
    units: 3245, 
    growth: 12.4,
    isPositive: true
  },
  { 
    id: 2,
    product: 'Whole Grain Bread', 
    sales: 8932, 
    units: 2789, 
    growth: 8.7,
    isPositive: true
  },
  { 
    id: 3,
    product: 'Organic Milk 1gal', 
    sales: 7845, 
    units: 1521, 
    growth: -2.3,
    isPositive: false
  },
  { 
    id: 4,
    product: 'Great Value Eggs', 
    sales: 6721, 
    units: 2211, 
    growth: 5.1,
    isPositive: true
  }
];

// Filter-specific data for different categories
const categorySpecificData = {
  food: [
    { category: 'Frozen Foods', sales: 18900 },
    { category: 'Canned Goods', sales: 14500 },
    { category: 'Snacks', sales: 12300 },
    { category: 'Beverages', sales: 9800 },
    { category: 'Condiments', sales: 7200 }
  ],
  bakery: [
    { category: 'Bread', sales: 9500 },
    { category: 'Pastries', sales: 8400 },
    { category: 'Cakes', sales: 7200 },
    { category: 'Desserts', sales: 6300 },
    { category: 'Specialty Items', sales: 4100 }
  ],
  clothing: [
    { category: 'Men\'s Apparel', sales: 6700 },
    { category: 'Women\'s Apparel', sales: 8900 },
    { category: 'Children\'s Wear', sales: 5400 },
    { category: 'Activewear', sales: 4300 },
    { category: 'Accessories', sales: 3800 }
  ],
  electronics: [
    { category: 'Cell Phones', sales: 22400 },
    { category: 'Computers', sales: 18700 },
    { category: 'TVs', sales: 15600 },
    { category: 'Audio Equipment', sales: 9800 },
    { category: 'Smart Home', sales: 7900 }
  ]
};

// Filter-specific product data for top performers
const brandSpecificProducts = {
  walmart: [
    { id: 1, product: 'Walmart Premium Coffee', sales: 15820, units: 4256, growth: 18.7, isPositive: true },
    { id: 2, product: 'Walmart Fresh Salads', sales: 12450, units: 3789, growth: 15.2, isPositive: true },
    { id: 3, product: 'Walmart Kitchen Appliances', sales: 9870, units: 1250, growth: 7.8, isPositive: true },
    { id: 4, product: 'Walmart Organic Produce', sales: 8650, units: 3210, growth: 9.5, isPositive: true }
  ],
  greatvalue: [
    { id: 1, product: 'Great Value Paper Towels', sales: 14520, units: 6240, growth: 5.3, isPositive: true },
    { id: 2, product: 'Great Value Frozen Pizza', sales: 11890, units: 4325, growth: -1.2, isPositive: false },
    { id: 3, product: 'Great Value Ice Cream', sales: 9640, units: 3180, growth: 12.6, isPositive: true },
    { id: 4, product: 'Great Value Cereals', sales: 7850, units: 3740, growth: 3.8, isPositive: true }
  ],
  samschoice: [
    { id: 1, product: 'Sam\'s Choice Steaks', sales: 19780, units: 2140, growth: 24.3, isPositive: true },
    { id: 2, product: 'Sam\'s Choice Pasta Sauce', sales: 13450, units: 5620, growth: 8.9, isPositive: true },
    { id: 3, product: 'Sam\'s Choice Premium Wines', sales: 10920, units: 1840, growth: 15.7, isPositive: true },
    { id: 4, product: 'Sam\'s Choice Gourmet Coffee', sales: 8750, units: 2980, growth: 6.2, isPositive: true }
  ]
};

const FilterPanel = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [brand, setBrand] = useState("all");
  const [metric, setMetric] = useState("sales");
  const [filteredSalesData, setFilteredSalesData] = useState(defaultSalesData);
  const [topProductsData, setTopProductsData] = useState(defaultProductsData);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleApplyFilters = () => {
    // Update filtered sales data based on category
    if (category !== "all" && categorySpecificData[category]) {
      setFilteredSalesData(categorySpecificData[category]);
    } else {
      setFilteredSalesData(defaultSalesData);
    }

    // Update top products data based on brand
    if (brand !== "all" && brandSpecificProducts[brand]) {
      setTopProductsData(brandSpecificProducts[brand]);
    } else {
      setTopProductsData(defaultProductsData);
    }

    setIsFiltered(true);
    
    toast({
      title: "Filters Applied",
      description: `Showing data for ${category === "all" ? "all categories" : category}, ${brand === "all" ? "all brands" : brand}, last ${dateRange === "7days" ? "7 days" : dateRange === "30days" ? "30 days" : dateRange === "quarter" ? "quarter" : "year to date"}, measuring ${metric}.`,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter & Analyze Data</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg">
          <Label className="block text-sm font-medium text-gray-700 mb-1">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="bakery">Bakery</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <Label className="block text-sm font-medium text-gray-700 mb-1">Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <Label className="block text-sm font-medium text-gray-700 mb-1">Brands</Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="walmart">Walmart</SelectItem>
              <SelectItem value="greatvalue">Great Value</SelectItem>
              <SelectItem value="samschoice">Sam's Choice</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <Label className="block text-sm font-medium text-gray-700 mb-1">Metrics</Label>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="profit">Profit</SelectItem>
              <SelectItem value="units">Units Sold</SelectItem>
              <SelectItem value="waste">Waste</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button 
          className="bg-[#4C2C92] text-white hover:bg-[#3A2171]" 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
      
      {isFiltered && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 text-green-700">
          <p className="font-medium">Filters applied successfully!</p>
          <p className="text-sm">
            Showing data for {category === "all" ? "all categories" : category}, 
            {brand === "all" ? " all brands" : ` ${brand}`}, 
            last {dateRange === "7days" ? "7 days" : dateRange === "30days" ? "30 days" : dateRange === "quarter" ? "quarter" : "year to date"}, 
            measuring {metric}.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Sales by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredSalesData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#4C2C92" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Top Performing Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProductsData.map(product => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{product.product}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right">
                      ${product.sales.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right">
                      {product.units.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isPositive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isPositive ? '+' : ''}{product.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
