import React from 'react';
import { motion } from 'motion/react';
import { Users as UsersIcon } from 'lucide-react';
import { Card } from '../components/ui/card';

const customers = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', orders: 24, spent: '$2,456', joined: 'Jan 2024', status: 'Active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', orders: 18, spent: '$1,890', joined: 'Feb 2024', status: 'Active' },
  { id: 3, name: 'Mike Davis', email: 'mike.davis@email.com', orders: 32, spent: '$3,120', joined: 'Dec 2023', status: 'Active' },
  { id: 4, name: 'Emily Brown', email: 'emily.b@email.com', orders: 12, spent: '$980', joined: 'Mar 2024', status: 'Active' },
  { id: 5, name: 'David Wilson', email: 'david.w@email.com', orders: 28, spent: '$2,680', joined: 'Jan 2024', status: 'Active' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa.a@email.com', orders: 8, spent: '$650', joined: 'Nov 2024', status: 'Inactive' },
];

export function Customers() {
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
          <h1 className="text-foreground">Customers</h1>
          <p className="text-muted-foreground">View and manage your customer base</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">Total Customers</p>
                <h3 className="text-foreground">2,845</h3>
              </div>
              <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                <UsersIcon className="w-6 h-6 text-[#0F4C81]" />
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">Active This Month</p>
                <h3 className="text-foreground">1,234</h3>
              </div>
              <div className="p-3 rounded-2xl bg-green-500/10">
                <UsersIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">New This Week</p>
                <h3 className="text-foreground">156</h3>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Customers Table */}
        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F4C81]/5">
                <tr className="border-b border-[#0F4C81]/10">
                  <th className="text-left py-4 px-6 text-foreground">Customer</th>
                  <th className="text-left py-4 px-6 text-foreground">Email</th>
                  <th className="text-left py-4 px-6 text-foreground">Orders</th>
                  <th className="text-left py-4 px-6 text-foreground">Total Spent</th>
                  <th className="text-left py-4 px-6 text-foreground">Joined</th>
                  <th className="text-left py-4 px-6 text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr 
                    key={customer.id}
                    className="border-b border-[#0F4C81]/5 hover:bg-[#0F4C81]/5 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/70 flex items-center justify-center text-white">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="text-foreground">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{customer.email}</td>
                    <td className="py-4 px-6 text-foreground">{customer.orders}</td>
                    <td className="py-4 px-6 text-foreground">{customer.spent}</td>
                    <td className="py-4 px-6 text-muted-foreground">{customer.joined}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        customer.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
