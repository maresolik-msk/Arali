import React from 'react';
import { useNavigate } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  title = "Upgrade Your Plan", 
  description = "You have reached the limit for your current plan. Upgrade to unlock more features and grow your business." 
}: UpgradeModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#0F4C81]">{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-gradient-to-r from-[#0F4C81]/5 to-[#0F4C81]/10 p-4 rounded-lg border border-[#0F4C81]/10">
            <h4 className="font-semibold text-[#0F4C81] mb-2">Why Upgrade?</h4>
            <ul className="text-sm text-[#082032]/70 space-y-2">
              <li className="flex items-center gap-2">✓ Unlimited Stores & SKUs</li>
              <li className="flex items-center gap-2">✓ Advanced Forecasting & AI</li>
              <li className="flex items-center gap-2">✓ Automation & Smart Alerts</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Maybe Later</Button>
          <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90" onClick={() => {
            navigate('/select-plan?mode=upgrade');
            onClose();
          }}>
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
