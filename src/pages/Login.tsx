
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShoppingBag, LayoutDashboard, Shield, ArrowLeft } from 'lucide-react';
import { useAppContext, UserRole } from '@/context/AppContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUserRole, setUserName, setIsLoggedIn } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<string>('customer');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Set active tab based on URL param
  useEffect(() => {
    const role = searchParams.get('role');
    if (role && ['customer', 'admin', 'security'].includes(role)) {
      setActiveTab(role);
    }
  }, [searchParams]);
  
  const handleLogin = () => {
    if (!name) {
      toast.error('Please enter your name');
      return;
    }
    
    if (activeTab !== 'customer' && !password) {
      toast.error('Please enter your password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      setUserName(name);
      setUserRole(activeTab as UserRole);
      setIsLoggedIn(true);
      
      // Redirect to appropriate dashboard
      switch (activeTab) {
        case 'admin':
          navigate('/admin');
          break;
        case 'customer':
          navigate('/customer');
          break;
        case 'security':
          navigate('/security');
          break;
        default:
          navigate('/');
      }
      
      toast.success(`Welcome, ${name}!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>
      
      <Card className="w-full max-w-md animate-scale-in glass-card">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">
            Sign in to 
            <span className="ml-2 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              QwikPay
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Customer</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield size={16} />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This is a demo app, no real data is stored.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Admin Name</Label>
                <Input
                  id="admin-name"
                  placeholder="Enter admin name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This is a demo app. Any password will work.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="security-name">Security Staff Name</Label>
                <Input
                  id="security-name"
                  placeholder="Enter security staff name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="security-password">Password</Label>
                <Input
                  id="security-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This is a demo app. Any password will work.
                </p>
              </div>
            </TabsContent>
            
            <Button 
              className="w-full mt-6 button-hover"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              By signing in, you agree to our simulated Terms and Privacy Policy.
            </p>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
