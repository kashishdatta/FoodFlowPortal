import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Timer, LineChart } from "lucide-react";

const AiPanel = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <Bot className="mr-2 h-5 w-5" />
        AI Insights & Recommendations
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Discount Recommendations</h3>
              <p className="text-sm text-gray-600">Based on inventory age and demand patterns</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Reordering Suggestions</h3>
              <p className="text-sm text-gray-600">Optimized order quantities based on sales velocity</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <LineChart className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Waste Reduction</h3>
              <p className="text-sm text-gray-600">Tactics to reduce waste and improve sustainability</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-700 mb-4">Suggested Actions</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Discount Dairy Products</h4>
                <p className="text-sm text-gray-600 mb-3">Yogurt inventory is aging and has 5 days until expiration. Consider a 15% discount to increase sales velocity.</p>
                <div className="flex items-center text-sm">
                  <Timer className="text-yellow-500 mr-1 h-4 w-4" />
                  <span className="text-gray-500">Recommended action timeframe: Next 24 hours</span>
                </div>
              </div>
              <Button className="bg-[#4C2C92] text-white hover:bg-[#3A2171]">Apply Now</Button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Reorder Fresh Produce</h4>
                <p className="text-sm text-gray-600 mb-3">Fresh vegetable inventory is running lower than optimal levels. Reorder 20% more than usual based on weekend sales forecast.</p>
                <div className="flex items-center text-sm">
                  <Timer className="text-blue-500 mr-1 h-4 w-4" />
                  <span className="text-gray-500">Recommended action timeframe: Today</span>
                </div>
              </div>
              <Button className="bg-[#4C2C92] text-white hover:bg-[#3A2171]">Order Now</Button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Reduce Bread Ordering</h4>
                <p className="text-sm text-gray-600 mb-3">Bread waste is 12% above target. Consider reducing order quantities by 8% to match actual demand patterns.</p>
                <div className="flex items-center text-sm">
                  <Timer className="text-green-500 mr-1 h-4 w-4" />
                  <span className="text-gray-500">Recommended action timeframe: Next order cycle</span>
                </div>
              </div>
              <Button className="bg-[#4C2C92] text-white hover:bg-[#3A2171]">Adjust Order</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-3">Ask AI Assistant</h3>
        <div className="relative">
          <Input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4C2C92] focus:border-transparent" 
            placeholder="Ask about inventory, sales patterns, or recommendations..." 
          />
          <Button 
            className="absolute right-3 top-3 text-[#4C2C92] p-0 h-auto" 
            variant="ghost"
          >
            <Bot className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;
