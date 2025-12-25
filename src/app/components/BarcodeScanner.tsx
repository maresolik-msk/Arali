import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Keyboard, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScanSuccess, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    if (!showManualEntry) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [showManualEntry]);

  const startScanner = async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode('barcode-scanner');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Successfully scanned
          toast.success('Barcode scanned!');
          
          // Stop scanner first
          await stopScanner();
          
          // Then trigger callback and close
          onScanSuccess(decodedText);
        },
        () => {
          // Scan error (ignore - happens frequently while scanning)
        }
      );

      setIsScanning(true);
      setHasPermission(true);
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setHasPermission(false);
      setIsScanning(false);
      
      // Provide specific error messages
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        setError('Camera permission denied. Please enable camera access in your browser settings.');
        toast.error('Camera permission denied', {
          description: 'Please allow camera access or use manual entry',
          duration: 5000,
        });
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
        toast.error('No camera detected');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
        toast.error('Camera unavailable');
      } else {
        setError('Unable to access camera. Try manual entry instead.');
        toast.error('Camera access failed');
      }
    }
  };

  const stopScanner = async () => {
    // Prevent multiple simultaneous stops
    if (isStoppingRef.current) {
      return;
    }

    if (scannerRef.current && isScanning) {
      isStoppingRef.current = true;
      try {
        const state = await scannerRef.current.getState();
        if (state === 2) { // 2 = SCANNING state
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
        setIsScanning(false);
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
        // Force cleanup even if stop fails
        setIsScanning(false);
        scannerRef.current = null;
      } finally {
        isStoppingRef.current = false;
      }
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScanSuccess(manualBarcode.trim());
      handleClose();
    } else {
      toast.error('Please enter a barcode');
    }
  };

  const handleRetry = async () => {
    setError(null);
    setHasPermission(null);
    setShowManualEntry(false);
    await stopScanner();
    setTimeout(() => startScanner(), 100);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-[#0F4C81]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-white" />
          <h2 className="text-white">
            {showManualEntry ? 'Enter Barcode Manually' : 'Scan Barcode'}
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        {showManualEntry ? (
          // Manual Entry Mode
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-[#0F4C81]/10">
                <Keyboard className="w-6 h-6 text-[#0F4C81]" />
              </div>
              <div>
                <h3 className="text-[#0F4C81] font-semibold">Manual Entry</h3>
                <p className="text-sm text-muted-foreground">Enter the barcode number</p>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="manual-barcode" className="text-[#0F4C81]">
                  Barcode / UPC / EAN
                </Label>
                <Input
                  id="manual-barcode"
                  type="text"
                  placeholder="e.g., 012345678905"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="h-12 text-lg bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81]"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Enter the barcode number found on the product
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowManualEntry(false)}
                  className="flex-1 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Use Camera
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white"
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        ) : (
          // Camera Scanner Mode
          <div className="w-full max-w-md">
            {error ? (
              // Error State
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Camera Access Required
                </h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg text-left">
                    <p className="text-sm font-medium text-[#0F4C81] mb-2">
                      To enable camera access:
                    </p>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      <li>Click the camera icon in your browser's address bar</li>
                      <li>Select "Allow" for camera permission</li>
                      <li>Click "Retry" below</li>
                    </ol>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleRetry}
                      className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry Camera
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => setShowManualEntry(true)}
                    variant="outline"
                    className="w-full border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
                  >
                    <Keyboard className="w-4 h-4 mr-2" />
                    Enter Barcode Manually
                  </Button>
                </div>
              </div>
            ) : (
              // Camera View
              <>
                <div
                  id="barcode-scanner"
                  className="rounded-lg overflow-hidden shadow-2xl border-4 border-white/20"
                />
                <p className="text-white text-center mt-4 mb-3">
                  Position the barcode within the frame
                </p>
                <Button
                  onClick={() => setShowManualEntry(true)}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  Enter Manually Instead
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}