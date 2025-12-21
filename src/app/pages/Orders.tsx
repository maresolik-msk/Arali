import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Card } from '../components/ui/card';

const orders = [
  { id: '#ORD-1234', customer: 'John Smith', date: '2024-12-21', amount: '$156.00', items: 5, status: 'Completed' },
  { id: '#ORD-1233', customer: 'Sarah Johnson', date: '2024-12-21', amount: '$89.50', items: 3, status: 'Processing' },
  { id: '#ORD-1232', customer: 'Mike Davis', date: '2024-12-21', amount: '$234.00', items: 8, status: 'Completed' },
  { id: '#ORD-1231', customer: 'Emily Brown', date: '2024-12-20', amount: '$67.25', items: 2, status: 'Pending' },
  { id: '#ORD-1230', customer: 'David Wilson', date: '2024-12-20', amount: '$145.80', items: 6, status: 'Completed' },
  { id: '#ORD-1229', customer: 'Lisa Anderson', date: '2024-12-20', amount: '$98.30', items: 4, status: 'Shipped' },
  { id: '#ORD-1228', customer: 'Robert Taylor', date: '2024-12-19', amount: '$210.00', items: 7, status: 'Completed' },
];

export function Orders() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Shipped':
        return 'bg-purple-100 text-purple-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
          <h1 className="text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track all your orders</p>
        </div>

        {/* Orders Table */}
        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F4C81]/5">
                <tr className="border-b border-[#0F4C81]/10">
                  <th className="text-left py-4 px-6 text-foreground">Order ID</th>
                  <th className="text-left py-4 px-6 text-foreground">Customer</th>
                  <th className="text-left py-4 px-6 text-foreground">Date</th>
                  <th className="text-left py-4 px-6 text-foreground">Items</th>
                  <th className="text-left py-4 px-6 text-foreground">Amount</th>
                  <th className="text-left py-4 px-6 text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr 
                    key={order.id}
                    className="border-b border-[#0F4C81]/5 hover:bg-[#0F4C81]/5 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-[#0F4C81]" />
                        </div>
                        <span className="text-foreground">{order.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-foreground">{order.customer}</td>
                    <td className="py-4 px-6 text-muted-foreground">{order.date}</td>
                    <td className="py-4 px-6 text-muted-foreground">{order.items} items</td>
                    <td className="py-4 px-6 text-foreground">{order.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
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
