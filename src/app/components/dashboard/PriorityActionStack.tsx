import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PriorityCard } from './PriorityCard';
import { PriorityCardData } from '../../data/dashboardData';

interface PriorityActionStackProps {
  cards: PriorityCardData[];
  onAction: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function PriorityActionStack({ cards, onAction, onDismiss }: PriorityActionStackProps) {
  if (cards.length === 0) {
    return (
      <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <p className="text-gray-500 font-medium">All caught up! No urgent actions needed.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0F4C81]">Priority Actions</h2>
        <span className="text-xs font-medium bg-[#0F4C81]/10 text-[#0F4C81] px-2 py-1 rounded-full">
          {cards.length} Pending
        </span>
      </div>
      
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 snap-x snap-mandatory md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="min-w-[85vw] sm:min-w-[400px] snap-center flex-shrink-0"
            >
              <PriorityCard
                data={card}
                index={index}
                onAction={onAction}
                onDismiss={onDismiss}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
