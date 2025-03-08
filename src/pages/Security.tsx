
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext, Bill, Product } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Check, QrCode, Clock, ShoppingBag, FileText, Download } from 'lucide-react';
import QRScanner from '@/components/QRScanner';
import { toast } from 'sonner';
import BillGenerator from '@/components/BillGenerator';

const Security = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, bills, userName, addBill, updateBill } = useAppContext();
  const [scannedBill, setScannedBill] = useState<Bill | null>(null);
  const [verifiedBills, setVerifiedBills] = useState<{bill: Bill, timestamp: Date}[]>([]);
  const [activeTab, setActiveTab] = useState('scan');
  const [showScanner, setShowScanner] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'security') {
      navigate('/login?role=security');
    }
  }, [isLoggedIn, userRole, navigate]);

  const handleScanBill = (result: string | Bill | Product | null) => {
    if (result && typeof result !== 'string' && 'items' in result) {
      setScannedBill(result as Bill);
      setShowScanner(false);
      toast.success('Bill scanned successfully');
    } else {
      toast.error('Invalid QR code. Please try again.');
    }
  };

  const handleVerifyBill = () => {
    if (scannedBill) {
      // Update bill in the database with verified status
      const updatedBill = {
        ...scannedBill,
        verifiedAt: new Date(),
        verifiedBy: userName,
        status: 'verified'
      };
      
      // Update the bill in the context
      if (updateBill) {
        updateBill(updatedBill);
      }
      
      setVerifiedBills([...verifiedBills, {
        bill: updatedBill,
        timestamp: new Date()
      }]);
      
      toast.success('Customer exit approved and database updated');
      setScannedBill(null);
    }
  };

  const handleShowDetails = () => {
    setShowBillDetails(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Security Panel</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <QrCode size={16} />
            <span>Scan Bills</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock size={16} />
            <span>Verification History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="animate-fade-in">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Verify Customer Exit</CardTitle>
            </CardHeader>
            <CardContent>
              {showScanner ? (
                <QRScanner 
                  scanType="bill" 
                  onScanSuccess={handleScanBill}
                  className="mb-4"
                />
              ) : (
                <div className="text-center py-6 mb-6">
                  {scannedBill ? (
                    <div className="rounded-lg border p-4 mb-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="font-medium">Bill #{scannedBill.id}</h3>
                        <Badge variant="outline">{new Date(scannedBill.createdAt).toLocaleString()}</Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-muted-foreground">Customer: {scannedBill.customerName}</p>
                        <div className="text-sm">
                          <p className="font-medium mb-1">Items:</p>
                          <ul className="space-y-1">
                            {scannedBill.items.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{item.product.name} × {item.quantity}</span>
                                <span>${((item.product.discountedPrice || item.product.price) * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total Amount:</span>
                          <span>${scannedBill.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Status:</span>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            {scannedBill.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={handleShowDetails}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          View Receipt
                        </Button>
                        <Button className="w-full" onClick={handleVerifyBill}>
                          <Check className="mr-2 h-4 w-4" />
                          Approve & Update DB
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <QrCode className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Ready to Scan</h3>
                      <p className="text-muted-foreground mb-6">
                        Scan customer bills to verify purchases before exit.
                      </p>
                      <Button onClick={() => setShowScanner(true)} className="button-hover">
                        Start Scanner
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="animate-fade-in">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Verification History</span>
                <Badge variant="outline">{verifiedBills.length} Bills</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verifiedBills.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No verifications yet</h3>
                  <p className="text-muted-foreground">
                    Verified bills will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {verifiedBills.map((entry, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Bill #{entry.bill.id}</h3>
                        <Badge variant="outline">{entry.timestamp.toLocaleString()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Customer: {entry.bill.customerName}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Items: {entry.bill.items.length}</span>
                        <span>Total: ${entry.bill.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t flex justify-end">
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Verified
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bill Detail Modal */}
      {scannedBill && (
        <BillGenerator
          bill={scannedBill}
          isOpen={showBillDetails}
          onClose={() => setShowBillDetails(false)}
        />
      )}
    </div>
  );
};

export default Security;
