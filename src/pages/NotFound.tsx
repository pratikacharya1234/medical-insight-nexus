
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="rounded-full w-16 h-16 bg-red-100 mx-auto flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-medical-danger" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-medical-primary">404</h1>
        <p className="text-xl text-medical-dark mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button
          className="bg-medical-primary hover:bg-medical-primary/90"
          asChild
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
