
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, userName, isLoggedIn, setIsLoggedIn, setUserRole, cartItems } = useAppContext();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('none');
    navigate('/login');
  };

  const getTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Dashboard';
      case 'customer':
        return 'Shopping Portal';
      case 'security':
        return 'Security Verification';
      default:
        return 'QwikPay';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span 
            className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/')}
          >
            QwikPay
          </span>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm font-medium">{getTitle()}</span>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <>
              {userRole === 'customer' && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                  onClick={() => navigate('/customer?tab=cart')}
                >
                  <ShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User size={16} />
                    <span className="max-w-[100px] truncate">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          {!isLoggedIn && (
            <Button size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
