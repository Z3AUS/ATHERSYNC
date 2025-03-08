
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext, Product, Bill } from '@/context/AppContext';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import ProductCard from '@/components/ProductCard';
import CartItem from '@/components/CartItem';
import BillGenerator from '@/components/BillGenerator';
import Navbar from '@/components/Navbar';
import { 
  Search, 
  ShoppingCart, 
  ShoppingBag, 
  QrCode, 
  MessageSquare, 
  CreditCard, 
  Send,
  Loader2,
  Store,
  Check,
} from 'lucide-react';

const Customer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    isLoggedIn, 
    products, 
    cartItems, 
    clearCart, 
    addBill, 
    userName, 
    setCurrentBill,
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<string>('shop');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState<boolean>(false);
  const [paymentProcessed, setPaymentProcessed] = useState<boolean>(false);
  const [showBill, setShowBill] = useState<boolean>(false);
  const [currentBill, setBill] = useState<Bill | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{message: string, isUser: boolean}[]>([]);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?role=customer');
    }
  }, [isLoggedIn, navigate]);
  
  // Set active tab based on URL param
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['shop', 'scan', 'cart', 'chat'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);
  
  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleScanResult = (result: string | Product | null) => {
    if (result && typeof result !== 'string') {
      // If the result is a product, add it to cart
      toast.success(`Successfully scanned: ${result.name}`);
    } else {
      toast.error('Failed to scan product. Please try again.');
    }
    setShowScanner(false);
  };
  
  const handleChatSend = () => {
    if (!chatMessage.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { message: chatMessage, isUser: true }]);
    const userMessage = chatMessage;
    setChatMessage('');
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let response = "I'm sorry, I don't understand that query.";
      
      // Simple pattern matching for demo purposes
      if (userMessage.toLowerCase().includes('hi') || 
          userMessage.toLowerCase().includes('hello')) {
        response = "Hello! How can I assist you with your shopping today?";
      } else if (userMessage.toLowerCase().includes('help')) {
        response = "I can help you find products, answer questions about the mall, or assist with payment issues. What do you need help with?";
      } else if (userMessage.toLowerCase().includes('payment')) {
        response = "To make a payment, add items to your cart and click 'Checkout'. You'll be guided through our secure payment process.";
      } else if (userMessage.toLowerCase().includes('return')) {
        response = "For returns, please visit our customer service desk on the ground floor with your receipt and the item you wish to return.";
      } else if (userMessage.toLowerCase().includes('hours') || 
                userMessage.toLowerCase().includes('timing')) {
        response = "The mall is open from 10:00 AM to 9:00 PM, Monday through Saturday, and 11:00 AM to 7:00 PM on Sundays.";
      } else if (userMessage.toLowerCase().includes('discount') || 
                userMessage.toLowerCase().includes('sale')) {
        response = "We currently have discounts on selected electronics and fashion items. Check the 'Shop' tab for items marked with discount badges!";
      } else if (userMessage.toLowerCase().includes('location') || 
                userMessage.toLowerCase().includes('find')) {
        response = "You can find store locations on the digital maps located throughout the mall, or I can help you locate specific stores if you tell me what you're looking for.";
      } else if (userMessage.toLowerCase().includes('biryani')) {
        response = "For biryani, you can visit our food court on the 3rd floor. 'Spice Paradise' and 'Royal Cuisine' both serve excellent biryani dishes!";
      }
      
      setChatHistory(prevChat => [...prevChat, { message: response, isUser: false }]);
    }, 1000);
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    
    setShowPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setShowPaymentProcessing(false);
      setPaymentProcessed(true);
      
      // Create a bill
      const newBill: Bill = {
        id: `BILL-${Math.floor(Math.random() * 10000)}`,
        customerId: '1',
        customerName: userName,
        items: [...cartItems],
        totalAmount: cartItems.reduce((total, item) => {
          const price = item.product.discountedPrice || item.product.price;
          return total + (price * item.quantity);
        }, 0),
        paymentStatus: 'completed',
        createdAt: new Date(),
        qrCode: `qr-${Math.floor(Math.random() * 10000)}`,
      };
      
      addBill(newBill);
      setBill(newBill);
      setCurrentBill(newBill);
      
      // Show bill after a short delay
      setTimeout(() => {
        setShowBill(true);
      }, 1000);
    }, 3000);
  };
  
  const handleCloseBill = () => {
    setShowBill(false);
    setPaymentProcessed(false);
    clearCart();
    setActiveTab('shop');
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountedPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };
  
  // Get recommended products (simple implementation for demo)
  const getRecommendedProducts = () => {
    // For demo, just return a few random products
    return products
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <Store size={16} />
              <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <QrCode size={16} />
              <span className="hidden sm:inline">Scan</span>
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2 relative">
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              {cartItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Shop Tab */}
          <TabsContent value="shop" className="animate-fade-in">
            <div className="mb-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {searchTerm && (
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {filteredProducts.length} results for "{searchTerm}"
                </p>
              )}
              
              {!searchTerm && (
                <div className="mb-8">
                  <h2 className="text-xl font-medium mb-4">Recommended for You</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getRecommendedProducts().map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
              
              <h2 className="text-xl font-medium mb-4">All Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or browse all products.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Scan Tab */}
          <TabsContent value="scan" className="animate-fade-in">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Scan Product QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                {showScanner ? (
                  <QRScanner 
                    scanType="product" 
                    onScanSuccess={handleScanResult}
                    className="mb-4"
                  />
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ready to Scan</h3>
                    <p className="text-muted-foreground mb-6">
                      Scan product QR codes to quickly add items to your cart.
                    </p>
                    <Button 
                      onClick={() => setShowScanner(true)}
                      className="button-hover"
                    >
                      Start Scanner
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Cart Tab */}
          <TabsContent value="cart" className="animate-fade-in">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Shopping Cart</CardTitle>
                <Badge variant="outline">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </Badge>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      Add products to your cart by browsing or scanning QR codes.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('shop')}
                      className="button-hover"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                      {cartItems.map((item) => (
                        <CartItem key={item.productId} item={item} />
                      ))}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tax (8%)</span>
                        <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${(calculateTotal() * 1.08).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      {showPaymentProcessing ? (
                        <Button disabled className="w-full">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </Button>
                      ) : paymentProcessed ? (
                        <Button className="w-full bg-green-500 hover:bg-green-600">
                          <Check className="mr-2 h-4 w-4" />
                          Payment Successful
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleCheckout} 
                          className="w-full button-hover"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Proceed to Checkout
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Bill generator modal */}
            <BillGenerator 
              bill={currentBill} 
              isOpen={showBill} 
              onClose={handleCloseBill} 
            />
          </TabsContent>
          
          {/* Chat Tab */}
          <TabsContent value="chat" className="animate-fade-in">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>AI Shopping Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[60vh]">
                  <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                    {chatHistory.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-2">How can I help you?</h3>
                        <p className="text-muted-foreground">
                          Ask me about products, store locations, or mall services.
                        </p>
                      </div>
                    ) : (
                      chatHistory.map((chat, index) => (
                        <div 
                          key={index} 
                          className={`flex ${chat.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              chat.isUser 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            {chat.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    />
                    <Button 
                      className="flex-shrink-0 button-hover"
                      onClick={handleChatSend}
                      disabled={!chatMessage.trim()}
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Customer;
