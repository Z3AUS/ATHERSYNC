
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Check, Download } from 'lucide-react';
import { Bill, useAppContext } from '@/context/AppContext';
import QRCode from 'qrcode.react';

interface BillGeneratorProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
}

const BillGenerator: React.FC<BillGeneratorProps> = ({ bill, isOpen, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  
  if (!bill) return null;
  
  // Handle download receipt as PNG
  const handleDownload = () => {
    setIsPrinting(true);
    
    // Convert QR code and receipt to image
    setTimeout(() => {
      const receiptElement = document.getElementById('receipt-content');
      if (receiptElement) {
        html2canvas(receiptElement).then(canvas => {
          const imageData = canvas.toDataURL('image/png');
          setDownloadUrl(imageData);
          
          // Create a download link
          const link = document.createElement('a');
          link.href = imageData;
          link.download = `receipt-${bill.id}.png`;
          link.click();
          
          setIsPrinting(false);
        });
      } else {
        // Fallback if conversion fails
        setIsPrinting(false);
      }
    }, 500);
  };
  
  const formattedDate = new Date(bill.createdAt).toLocaleString();
  
  // Calculate totals
  const subtotal = bill.items.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  // Create QR code data with complete bill information
  const qrData = JSON.stringify({
    billId: bill.id,
    customer: bill.customerName,
    date: formattedDate,
    items: bill.items.map(item => ({
      name: item.product.name,
      qty: item.quantity,
      price: item.product.discountedPrice || item.product.price
    })),
    total: total,
    paymentStatus: bill.paymentStatus,
    verified: bill.status === 'verified'
  });

  // Function to simulate HTML2Canvas
  const html2canvas = (element: HTMLElement): Promise<HTMLCanvasElement> => {
    return new Promise(resolve => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = element.offsetWidth;
      canvas.height = element.offsetHeight;
      const ctx = canvas.getContext('2d');
      
      // In a real implementation, this would convert the HTML to an image
      // Here we're just creating a simple canvas
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.fillText(`Receipt #${bill.id}`, 20, 30);
      }
      
      setTimeout(() => resolve(canvas), 300);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Digital Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div id="receipt-content" className="py-4 space-y-6">
          {/* QR Code */}
          <div ref={qrRef} className="bg-white p-4 mx-auto w-48 aspect-square flex items-center justify-center rounded-lg border">
            <QRCode 
              value={qrData}
              size={160}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/og-image.png",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          
          {/* Bill details */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-muted-foreground">Bill ID:</span>
              <span className="font-mono">{bill.id}</span>
            </div>
            
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-muted-foreground">Customer:</span>
              <span>{bill.customerName}</span>
            </div>
            
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-muted-foreground">Date & Time:</span>
              <span>{formattedDate}</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Items</div>
              {bill.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    ${((item.product.discountedPrice || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="rounded-lg bg-primary/10 px-3 py-1 text-primary text-sm font-medium flex items-center">
                <Check size={16} className="mr-1" />
                {bill.paymentStatus === 'completed' ? 'Payment Complete' : 'Payment Pending'}
              </div>
            </div>
            
            {/* Verification Status */}
            {bill.status === 'verified' && (
              <div className="flex justify-center mt-2">
                <div className="rounded-lg bg-green-50 px-3 py-1 text-green-600 text-sm font-medium flex items-center">
                  <Check size={16} className="mr-1" />
                  Verified by {bill.verifiedBy} at {bill.verifiedAt?.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={isPrinting} 
            className="w-full sm:w-auto button-hover"
          >
            {isPrinting ? (
              <span className="flex items-center">Processing...</span>
            ) : (
              <span className="flex items-center">
                <Download size={16} className="mr-2" />
                Download Receipt
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillGenerator;
