import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Bell, 
  Filter, 
  Bot,
  Archive,
  Truck,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";

interface SidebarProps {
  user: User;
  activeSection?: 'dashboard' | 'notify' | 'filter' | 'ai';
  onSectionChange: (section: 'notify' | 'filter' | 'ai') => void;
}

interface SidebarLinkProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ href, icon, label, count, isActive, onClick }: SidebarLinkProps) => {
  const content = (
    <div
      className={cn(
        "hover:bg-[#3A2171] hover:bg-opacity-30 flex items-center px-4 py-3 text-white rounded-lg cursor-pointer",
        isActive && "bg-[#3A2171] bg-opacity-30"
      )}
      onClick={onClick}
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span className="ml-auto bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

const StoreManagerSidebar = ({ user, activeSection, onSectionChange }: SidebarProps) => {
  const [location] = useLocation();

  return (
    <div className="h-full flex flex-col bg-[#4C2C92] text-white">
      <div className="p-4 flex items-center space-x-3">
        <img
          src="https://1000logos.net/wp-content/uploads/2017/05/Color-Walmart-logo.jpg"
          alt="FoodFlow Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-bold">FoodFlow</h2>
          <p className="text-xs opacity-80">Store Manager</p>
        </div>
      </div>

      <div className="mt-6 mb-6">
        <div className="profile-info flex items-center px-4 py-2">
          <img
            src={user.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
            alt="Store Manager Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="text-sm font-medium">{user.username}</div>
            <div className="text-xs opacity-80">Store #{user.storeId}</div>
          </div>
        </div>
      </div>

      <nav className="px-2 space-y-1 flex-1">
        <SidebarLink
          href="/store-manager/dashboard"
          icon={<LayoutDashboard />}
          label="Dashboard"
          isActive={location === "/store-manager/dashboard" && activeSection === 'dashboard'}
        />
        <SidebarLink
          icon={<Bell />}
          label="Notify"
          count={3}
          isActive={activeSection === 'notify'}
          onClick={() => onSectionChange('notify')}
        />
        <SidebarLink
          icon={<Filter />}
          label="Filter"
          isActive={activeSection === 'filter'}
          onClick={() => onSectionChange('filter')}
        />
        <SidebarLink
          icon={<Bot />}
          label="AI"
          isActive={activeSection === 'ai'}
          onClick={() => onSectionChange('ai')}
        />
        <SidebarLink
          href="/store-manager/suppliers"
          icon={<Truck />}
          label="Suppliers"
          isActive={location === "/store-manager/suppliers"}
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

export default StoreManagerSidebar;
