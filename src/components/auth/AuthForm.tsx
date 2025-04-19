
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope, User, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type UserRole = "patient" | "doctor" | "admin";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        toast.error("Passwords don't match");
        setIsLoading(false);
        return;
      }

      // Simulate auth process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isLogin) {
        toast.success("Login successful");
        // Navigate to dashboard after login would go here
        console.log("Logged in with:", { email, password });
      } else {
        toast.success("Account created successfully");
        // Navigate to dashboard after registration would go here
        console.log("Registered with:", { name, email, password, role });
      }
    } catch (error) {
      toast.error("Authentication failed");
      console.error(error);
    }
    
    setIsLoading(false);
  };

  const getRoleIcon = (userRole: UserRole) => {
    switch (userRole) {
      case "patient":
        return <User className="h-4 w-4" />;
      case "doctor":
        return <Stethoscope className="h-4 w-4" />;
      case "admin":
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Sign In" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? "Access the Medical Diagnostic Assistant"
            : "Join the Medical Diagnostic Platform"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="login" onValueChange={(v) => setIsLogin(v === "login")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm text-medical-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regEmail">Email</Label>
                <Input
                  id="regEmail"
                  type="email"
                  placeholder="mail@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Patient
                      </div>
                    </SelectItem>
                    <SelectItem value="doctor">
                      <div className="flex items-center">
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Healthcare Provider
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPassword">Password</Label>
                <Input
                  id="regPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
          <Button
            type="submit"
            className="w-full bg-medical-primary hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>{isLogin ? "Sign In" : "Create Account"}</>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Need an account? " : "Already have an account? "}
          <a
            href="#"
            className="text-medical-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setIsLogin(!isLogin);
            }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
