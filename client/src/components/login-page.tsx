import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface LoginPageProps {
  role: "supplier" | "storeManager";
}

const LoginPage = ({ role }: LoginPageProps) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roleName = role === "supplier" ? "Supplier" : "Store Manager";
  const roleColor = role === "supplier" ? "bg-[#0094D6]" : "bg-[#4C2C92]";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      toast({
        title: "Error",
        description: "User ID and password are required",
        variant: "destructive",
      });
      return;
    }

    // Validate userId is 10 digits
    if (!/^\d{10}$/.test(userId)) {
      toast({
        title: "Error",
        description: "User ID must be a 10-digit number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/login", {
        userId,
        password,
        role,
      });
      
      const user = await response.json();
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      toast({
        title: "Success",
        description: `Logged in as ${roleName}`,
      });
      
      // Redirect to appropriate dashboard
      if (role === "supplier") {
        setLocation("/supplier/dashboard");
      } else {
        setLocation("/store-manager/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid User ID or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Logo at the top */}
      <img src="/F.png" alt="Food Flow Logo" className="w-32 h-32 mb-6" />
      <Card className="w-full max-w-md bg-white rounded-xl shadow-md">
        <CardContent className="pt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full shadow bg-white flex items-center justify-center">
              <img 
                src="/F.png" 
                alt="FoodFlow Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">{roleName} Login</h1>
            <p className="text-gray-600">Access your {role === "supplier" ? "supplier" : "store manager"} account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID (10 digits)</Label>
              <Input
                id="userId"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{10}"
                placeholder={role === "supplier" ? "9876543210" : "1234567890"}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm font-medium text-[#0071DC] hover:text-[#0094D6]">
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              className={`w-full ${roleColor} hover:${roleColor} text-white`} 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-gray-500">
              <b>Store Manager:</b> User ID: 1234567890, Password: password123
            </p>
            <p className="text-xs text-gray-500">
              <b>Supplier:</b> User ID: 9876543210, Password: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
