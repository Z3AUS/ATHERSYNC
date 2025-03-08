
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ScanLine, Camera, Ban } from 'lucide-react';
import { useAppContext, Product, Bill } from '@/context/AppContext';
import { toast } from 'sonner';

interface QRScannerProps {
  onScanSuccess?: (result: string | Product | Bill | null) => void;
  scanType: 'product' | 'bill';
  className?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, scanType, className }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { products, bills } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check for camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoInput);
        if (!hasVideoInput) {
          setCameraError('No camera detected on this device.');
        }
      } catch (error) {
        console.error('Error checking camera:', error);
        setHasCamera(false);
        setCameraError('Unable to access camera. Please check permissions.');
      }
    };

    checkCamera();
  }, []);

  // Initialize camera when scanning starts
  useEffect(() => {
    const initializeCamera = async () => {
      if (!isScanning || !hasCamera || !videoRef.current) return;

      try {
        const constraints = {
          video: {
            facingMode: 'environment', // Prefer back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning animation
        setScanProgress(0);
        const interval = setInterval(() => {
          setScanProgress(prev => {
            const newProgress = prev + 3;
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(() => handleScanComplete(), 500);
              return 100;
            }
            return newProgress;
          });
        }, 50);

        return () => {
          clearInterval(interval);
        };
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCamera(false);
        setCameraError('Unable to access camera. Please check permissions.');
        setIsScanning(false);
      }
    };

    initializeCamera();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isScanning, hasCamera]);

  const startScanning = () => {
    if (!hasCamera) {
      // Fall back to simulated scanning if no camera is available
      setIsScanning(true);
      setScanProgress(0);
      const interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => handleScanComplete(), 500);
            return 100;
          }
          return newProgress;
        });
      }, 50);
    } else {
      setIsScanning(true);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanProgress(0);
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleScanComplete = () => {
    stopScanning();
    
    // Simulate finding a result
    if (scanType === 'product') {
      // Randomly select a product from the available ones
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      if (randomProduct) {
        toast.success('Product scanned successfully');
        if (onScanSuccess) onScanSuccess(randomProduct);
      } else {
        toast.error('No product found for this QR code');
        if (onScanSuccess) onScanSuccess(null);
      }
    } else if (scanType === 'bill') {
      // For bills, just create a dummy bill and return it
      if (bills.length > 0) {
        const randomBill = bills[Math.floor(Math.random() * bills.length)];
        toast.success('Bill scanned successfully');
        if (onScanSuccess) onScanSuccess(randomBill);
      } else {
        // Create a dummy bill id if no bills exist
        toast.error('No bill found for this QR code');
        if (onScanSuccess) onScanSuccess(null);
      }
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-video bg-black/5 relative flex items-center justify-center overflow-hidden">
        {/* Camera preview or fallback area */}
        <div className="w-full h-full flex flex-col items-center justify-center">
          {!isScanning ? (
            <div className="text-center p-4">
              {cameraError ? (
                <>
                  <Ban className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">{cameraError}</p>
                  <p className="text-muted-foreground mb-4">
                    Using simulated scanning instead.
                  </p>
                </>
              ) : (
                <>
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {scanType === 'product' 
                      ? 'Scan a product QR code to add it to cart'
                      : 'Scan a bill QR code to verify'
                    }
                  </p>
                </>
              )}
              <Button onClick={startScanning} className="button-hover">
                Start Scanning
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {/* Camera view */}
              {hasCamera && (
                <video 
                  ref={videoRef} 
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline 
                  muted
                />
              )}
              
              {/* Scanning animation overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Scanning line */}
                <div 
                  className="absolute left-0 w-full h-1 bg-primary/70 transition-transform duration-100"
                  style={{ 
                    top: `${(scanProgress / 100) * 100}%`,
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.7), 0 0 20px rgba(59, 130, 246, 0.5)'
                  }}
                />
                
                {/* Scan lines animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine 
                    size={120} 
                    className="text-primary/80 animate-pulse"
                  />
                </div>
                
                {/* Scanner target corners */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/80" />
                  <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/80" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary/80" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/80" />
                </div>
              </div>
              
              {/* Progress text */}
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white bg-black/50 py-1 px-2 rounded-full inline-block">
                  Scanning... {scanProgress}%
                </p>
              </div>
              
              {/* Stop button */}
              <Button 
                variant="destructive" 
                size="sm" 
                className="absolute top-4 right-4"
                onClick={stopScanning}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
