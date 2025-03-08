
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShoppingBag, Shield, LayoutDashboard, QrCode, Zap } from 'lucide-react';

const features = [
  {
    title: 'Quick Scanning',
    description: 'Scan product QR codes for instant details and checkout.',
    icon: QrCode,
  },
  {
    title: 'No More Queues',
    description: 'Skip the billing counter with our digital payment system.',
    icon: Zap,
  },
  {
    title: 'Digital Receipts',
    description: 'Get QR-based digital receipts for easy verification.',
    icon: ShoppingBag,
  },
];

const roles = [
  {
    title: 'Customer',
    description: 'Browse products, scan QR codes, and checkout digitally.',
    icon: ShoppingBag,
    color: 'bg-blue-500',
    path: '/login?role=customer',
  },
  {
    title: 'Admin',
    description: 'Manage products, staff, and monitor sales.',
    icon: LayoutDashboard,
    color: 'bg-purple-500',
    path: '/login?role=admin',
  },
  {
    title: 'Security',
    description: 'Verify customer exits with QR bill scanning.',
    icon: Shield,
    color: 'bg-green-500',
    path: '/login?role=security',
  },
];

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-white -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70 -z-10" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70 -z-10" />
        
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              <span className="inline-block">Shop Smarter with </span>
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                QwikPay
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Skip the queues with our revolutionary QR-based shopping and checkout system. 
              Browse, scan, pay, and leave - all without waiting in line.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="button-hover"
                onClick={() => navigate('/login?role=customer')}
              >
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="button-hover"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
          
          {/* QR Code Demo */}
          <div className="max-w-sm mx-auto bg-white rounded-xl overflow-hidden shadow-lg animate-fade-in">
            <div className="p-6 text-center">
              <div className="mb-4 mx-auto w-48 h-48 bg-gray-50 rounded-lg border flex items-center justify-center">
                <QrCode size={160} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Scan this QR code to start shopping (simulated)
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QwikPay simplifies your shopping experience through innovative digital solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover-scale">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Role Selection */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your role to access the appropriate interface.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover-scale glass-card border-t-4"
                style={{ borderTopColor: `var(--${role.color})` }}
              >
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${role.color} bg-opacity-10 rounded-lg flex items-center justify-center mb-4`}>
                    <role.icon className={`w-6 h-6 ${role.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{role.title}</h3>
                  <p className="text-muted-foreground mb-4">{role.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full button-hover"
                    onClick={() => navigate(role.path)}
                  >
                    Continue as {role.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                QwikPay
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                Mall Queue Management System
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 QwikPay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
