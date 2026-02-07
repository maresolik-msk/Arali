import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { businessVerificationApi } from '../services/api';

interface BusinessVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type DocumentType = 'GST' | 'UDYAM' | 'SHOP_LICENSE' | 'TRADE_LICENSE';

export function BusinessVerificationModal({ isOpen, onClose, onSuccess }: BusinessVerificationModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [docType, setDocType] = useState<DocumentType>('GST');
  const [docNumber, setDocNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ status: string; message?: string } | null>(null);

  const handleSubmit = async () => {
    if (!docType) return;
    if ((docType === 'GST' || docType === 'UDYAM') && !docNumber) {
      toast.error('Please enter document number');
      return;
    }
    if ((docType === 'SHOP_LICENSE' || docType === 'TRADE_LICENSE') && !file) {
      toast.error('Please upload a document');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await businessVerificationApi.verify({
        documentType: docType,
        documentNumber: docNumber,
        file: file || undefined
      });
      
      setResult({ status: response.status, message: response.message });
      setStep(2);
      if (response.status === 'VERIFIED' || response.status === 'PENDING') {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setDocType('GST');
    setDocNumber('');
    setFile(null);
    setResult(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Business Verification
          </DialogTitle>
          <DialogDescription>
            Verify your business to unlock Payments, Billing, and Staff Management features.
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="doctype">Document Type</Label>
              <Select 
                value={docType} 
                onValueChange={(v) => setDocType(v as DocumentType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GST">GST Certificate</SelectItem>
                  <SelectItem value="UDYAM">UDYAM Registration</SelectItem>
                  <SelectItem value="SHOP_LICENSE">Shop Act License</SelectItem>
                  <SelectItem value="TRADE_LICENSE">Trade License</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(docType === 'GST' || docType === 'UDYAM') && (
              <div className="grid gap-2">
                <Label htmlFor="docnumber">
                  {docType === 'GST' ? 'GSTIN Number' : 'Udyam Registration Number'}
                </Label>
                <Input
                  id="docnumber"
                  placeholder={docType === 'GST' ? '22AAAAA0000A1Z5' : 'UDYAM-XX-00-0000000'}
                  value={docNumber || ''}
                  onChange={(e) => setDocNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We will automatically verify this with government records.
                </p>
              </div>
            )}

            {(docType === 'SHOP_LICENSE' || docType === 'TRADE_LICENSE') && (
              <div className="grid gap-2">
                <Label>Upload Document Image</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF (Max 5MB)</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
             {result?.status === 'VERIFIED' ? (
               <>
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 className="w-8 h-8 text-green-600" />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900">Verification Successful!</h3>
                 <p className="text-sm text-gray-500 mt-2">
                   Your business is now verified. You have full access to all features.
                 </p>
               </>
             ) : result?.status === 'PENDING' ? (
               <>
                 <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                   <ShieldCheck className="w-8 h-8 text-amber-600" />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900">Submission Received</h3>
                 <p className="text-sm text-gray-500 mt-2">
                   Your document is under review. We will notify you once verified.
                 </p>
               </>
             ) : (
               <>
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                   <XCircle className="w-8 h-8 text-red-600" />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900">Verification Failed</h3>
                 <p className="text-sm text-gray-500 mt-2">
                   {result?.message || 'We could not verify your document. Please try again.'}
                 </p>
               </>
             )}
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <div className="flex w-full justify-between sm:justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Verify Now
              </Button>
            </div>
          ) : (
            <Button onClick={handleClose} className="w-full sm:w-auto">
              {result?.status === 'VERIFIED' ? 'Get Started' : 'Close'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
