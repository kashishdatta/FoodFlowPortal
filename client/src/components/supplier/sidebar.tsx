import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Store, 
  Truck, 
  Inbox, 
  BarChart3, 
  FileText,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";

interface SidebarProps {
  user: User;
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
}

const SidebarLink = ({ href, icon, label, count, isActive }: SidebarLinkProps) => {
  return (
    <Link href={href}>
      <a className={cn(
        "hover:bg-[#0080B8] hover:bg-opacity-30 flex items-center px-4 py-3 text-white rounded-lg",
        isActive && "bg-[#0080B8] bg-opacity-30"
      )}>
        <span className="mr-3 text-lg">{icon}</span>
        <span>{label}</span>
        {count !== undefined && (
          <span className="ml-auto bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center text-gray-800">
            {count}
          </span>
        )}
      </a>
    </Link>
  );
};

const SupplierSidebar = ({ user }: SidebarProps) => {
  const [location] = useLocation();

  return (
    <div className="h-full flex flex-col bg-[#0094D6] text-white">
      <div className="p-4 flex items-center space-x-3">
        <img
          src="https://1000logos.net/wp-content/uploads/2017/05/Color-Walmart-logo.jpg"
          alt="FoodFlow Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-bold">FoodFlow</h2>
          <p className="text-xs opacity-80">Supplier</p>
        </div>
      </div>

      <div className="mt-6 mb-6">
        <div className="profile-info flex items-center px-4 py-2">
          <img
            src={user.profileImage || "https://randomuser.me/api/portraits/men/43.jpg"}
            alt="Supplier Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="text-sm font-medium">{user.username}</div>
            <div className="text-xs opacity-80">{user.companyName}</div>
          </div>
        </div>
      </div>

      <nav className="px-2 space-y-1 flex-1">
        <SidebarLink
          href="/supplier/dashboard"
          icon={<LayoutDashboard />}
          label="Dashboard"
          isActive={location === "/supplier/dashboard"}
        />
        <SidebarLink
          href="/supplier/stores"
          icon={<Store />}
          label="Stores"
          isActive={location === "/supplier/stores"}
        />
        <SidebarLink
          href="/supplier/shipments"
          icon={<Truck />}
          label="Shipments"
          count={3}
          isActive={location === "/supplier/shipments"}
        />
        <SidebarLink
          href="/supplier/requests"
          icon={<Inbox />}
          label="Requests"
          count={5}
          isActive={location === "/supplier/requests"}
        />
        <SidebarLink
          href="/supplier/analytics"
          icon={<BarChart3 />}
          label="Analytics"
          isActive={location === "/supplier/analytics"}
        />
      </nav>

      <div className="p-4">
        <Link href="/">
          <a className="w-full flex items-center justify-center px-4 py-2 text-white opacity-80 hover:opacity-100">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default SupplierSidebar;
