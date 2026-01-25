import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Store, Bell, User, CreditCard } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { shopSettingsApi, type ShopSettings } from '../services/api';
import { toast } from 'sonner';
import { PWAStatus } from '../components/PWAStatus';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DashboardSettings() {
  const [storeName, setStoreName] = React.useState('');
  const [storeAddress, setStoreAddress] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [storeLogo, setStoreLogo] = React.useState('');
  const [fullName, setFullName] = React.useState('John Doe');
  const [phoneNumber, setPhoneNumber] = React.useState('+1 (555) 123-4567');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);

  // Load shop settings on mount
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await shopSettingsApi.get();
        setStoreName(settings.shopName || '');
        setStoreAddress(settings.shopAddress || '');
        setContactEmail(settings.contactEmail || '');
        setStoreLogo(settings.shopLogoUrl || '');
      } catch (error) {
        console.error('Error loading shop settings:', error);
        toast.error('Failed to load shop settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await shopSettingsApi.uploadLogo(file);
      setStoreLogo(url);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveStoreSettings = async () => {
    try {
      await shopSettingsApi.update({
        shopName: storeName,
        shopAddress: storeAddress,
        contactEmail: contactEmail,
        shopLogoUrl: storeLogo,
      });
      toast.success('Store settings saved successfully!');
    } catch (error) {
      console.error('Error saving store settings:', error);
      toast.error('Failed to save store settings');
    }
  };

  const handleUpdateProfile = () => {
    const settings: ShopSettings = {
      storeName,
      storeAddress,
      fullName,
      phoneNumber
    };
    shopSettingsApi.update(settings)
      .then(() => toast.success('Profile updated!'))
      .catch(() => toast.error('Failed to update profile.'));
  };

  const handleChangePassword = () => {
    const currentPassword = prompt('Enter current password:');
    if (currentPassword) {
      const newPassword = prompt('Enter new password:');
      if (newPassword) {
        const confirmPassword = prompt('Confirm new password:');
        if (newPassword === confirmPassword) {
          alert('Password changed successfully!');
        } else {
          alert('Passwords do not match. Please try again.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC]">
      <motion.div
        className="p-6 md:p-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div>
          <h1 className="text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your store preferences and configurations</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Store Information */}
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                  <Store className="w-6 h-6 text-[#0F4C81]" />
                </div>
                <div>
                  <h3 className="text-foreground">Store Information</h3>
                  <p className="text-muted-foreground">Update your store details</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-foreground mb-2 block">Store Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 flex items-center justify-center overflow-hidden relative group">
                      {storeLogo ? (
                        <img src={storeLogo} alt="Store Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-8 h-8 text-[#0F4C81]/40" />
                      )}
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-white text-xs font-medium">Change</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleLogoUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Upload a logo for your store. Recommended size: 512x512px.
                      </p>
                      {isUploading && <p className="text-xs text-[#0F4C81] mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-foreground mb-2 block">Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 focus:border-[#0F4C81]/30 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-foreground mb-2 block">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 focus:border-[#0F4C81]/30 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-foreground mb-2 block">Store Address</label>
                  <input
                    type="text"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 focus:border-[#0F4C81]/30 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
              <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full" onClick={handleSaveStoreSettings}>
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                  <Bell className="w-6 h-6 text-[#0F4C81]" />
                </div>
                <div>
                  <h3 className="text-foreground">Notifications</h3>
                  <p className="text-muted-foreground">Configure your notification preferences</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10">
                  <div>
                    <p className="text-foreground mb-1">Order Notifications</p>
                    <p className="text-muted-foreground">Receive alerts for new orders</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10">
                  <div>
                    <p className="text-foreground mb-1">Low Stock Alerts</p>
                    <p className="text-muted-foreground">Get notified when items are running low</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10">
                  <div>
                    <p className="text-foreground mb-1">Marketing Emails</p>
                    <p className="text-muted-foreground">Receive tips and updates from Arali</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                  <User className="w-6 h-6 text-[#0F4C81]" />
                </div>
                <div>
                  <h3 className="text-foreground">Account Settings</h3>
                  <p className="text-muted-foreground">Manage your account information</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-foreground mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 focus:border-[#0F4C81]/30 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-foreground mb-2 block">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 px-3 bg-[#0F4C81]/10 rounded-l-xl flex items-center border-r border-[#0F4C81]/10">
                      <span className="text-foreground font-medium text-sm flex items-center gap-1">
                        🇮🇳 +91
                      </span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber.startsWith('+91 ') ? phoneNumber.slice(4) : phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhoneNumber(`+91 ${value}`);
                      }}
                      placeholder="98765 43210"
                      className="w-full h-12 pl-24 pr-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 focus:border-[#0F4C81]/30 focus:bg-white transition-all outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full" onClick={handleUpdateProfile}>
                  Update Profile
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5 rounded-full"
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </Card>

          {/* PWA Status */}
          <PWAStatus />
        </div>
      </motion.div>
    </div>
  );
}