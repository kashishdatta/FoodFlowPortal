import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Package2 } from "lucide-react";
import { Link } from "wouter";
import IconWrapper from "./ui/icon-wrapper";

interface RoleCardProps {
  role: "supplier" | "storeManager";
  title: string;
  description: string;
  icon: React.ReactNode;
}

const RoleCard = ({ role, title, description, icon }: RoleCardProps) => {
  const colors = {
    supplier: "bg-[#0094D6] bg-opacity-10 text-[#0094D6]",
    storeManager: "bg-[#4C2C92] bg-opacity-10 text-[#4C2C92]",
  };

  const buttonColors = {
    supplier: "bg-[#0094D6] hover:bg-[#0080B8] text-white",
    storeManager: "bg-[#4C2C92] hover:bg-[#3A2171] text-white",
  };

  return (
    <Link href={`/login/${role}`}>
      <Card className="card bg-white p-8 rounded-xl shadow-md hover:shadow-xl flex flex-col items-center text-center transition-all cursor-pointer">
        <IconWrapper className={`${colors[role]} p-4 rounded-full mb-4`}>
          {icon}
        </IconWrapper>
        <h2 className={`text-2xl font-semibold ${colors[role]} mb-2`}>{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button className={buttonColors[role]}>
          Login as {title.split(" ")[1]}
        </Button>
      </Card>
    </Link>
  );
};

const LandingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center mb-16">
        <div className="w-36 h-36 mx-auto mb-6 rounded-full shadow-lg bg-white flex items-center justify-center">
          <img 
            src="/F.png" 
            alt="FoodFlow Logo" 
            className="w-28 h-28 object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-[#0071DC] mb-2">FoodFlow</h1>
        <p className="text-gray-600 text-xl">by Walmart</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <RoleCard
          role="supplier"
          title="Login as Supplier"
          description="Manage product deliveries, view requests, and communicate with store managers"
          icon={<Truck className="h-8 w-8" />}
        />

        <RoleCard
          role="storeManager"
          title="Login as Store Manager"
          description="Monitor sales, analyze waste production, and request products from suppliers"
          icon={<Package2 className="h-8 w-8" />}
        />
      </div>
    </div>
  );
};

export default LandingPage;
