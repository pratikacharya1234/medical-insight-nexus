
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  FileImage, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Stethoscope, 
  Users,
  Database,
  FileText
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";

type SidebarItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  roles?: Array<"patient" | "doctor" | "admin">;
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"patient" | "doctor" | "admin">("doctor");

  const navigation: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Activity,
      roles: ["patient", "doctor", "admin"],
    },
    {
      name: "Diagnostics",
      href: "/diagnostics",
      icon: FileImage,
      roles: ["doctor", "admin"],
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
      roles: ["doctor", "admin"],
    },
    {
      name: "My Records",
      href: "/records",
      icon: FileText,
      roles: ["patient"],
    },
    {
      name: "Database",
      href: "/database",
      icon: Database,
      disabled: true,
      roles: ["admin"],
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      roles: ["patient", "doctor", "admin"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["patient", "doctor", "admin"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleLogout = () => {
    // Handle logout functionality here
    navigate("/");
  };

  const userRoleLabel = () => {
    switch (userRole) {
      case "admin":
        return "Administrator";
      case "doctor":
        return "Healthcare Provider";
      case "patient":
        return "Patient";
      default:
        return "User";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out lg:relative",
          isOpen ? "w-64" : "w-16"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className={cn("flex items-center", !isOpen && "justify-center w-full")}>
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-medical-primary">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
            </div>
            {isOpen && (
              <h1 className="ml-2 text-lg font-bold text-medical-primary">
                MedInsight
              </h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className={cn("lg:hidden", !isOpen && "absolute right-2")}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar content */}
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <nav className="flex-1 space-y-1 px-2">
            {filteredNavigation.map((item) => (
              <Button
                key={item.name}
                onClick={() => !item.disabled && handleNavigation(item.href)}
                variant="ghost"
                className={cn(
                  "w-full justify-start py-2 px-3 mb-1",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  !isOpen && "justify-center px-0"
                )}
              >
                <item.icon className={cn("h-5 w-5", !isOpen && "mx-auto")} />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Button>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-medical-primary text-white">
                    {userRole === "doctor" ? "DS" : userRole === "admin" ? "AA" : "PT"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {userRole === "doctor" ? "Dr. Sam Lee" : userRole === "admin" ? "Admin User" : "John Doe"}
                  </p>
                  <p className="text-xs text-muted-foreground">{userRoleLabel()}</p>
                </div>
              </div>
            )}
            {!isOpen && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-medical-primary text-white">
                  {userRole === "doctor" ? "DS" : userRole === "admin" ? "AA" : "PT"}
                </AvatarFallback>
              </Avatar>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className={cn("text-sidebar-foreground hover:bg-sidebar-accent/50", !isOpen && "mx-auto")}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-medical-primary">MedInsight</h1>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
