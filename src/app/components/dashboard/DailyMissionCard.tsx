import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, ArrowRight, AlertOctagon, AlertTriangle } from 'lucide-react';
import { DailyMission } from '../../services/api';
import { useNavigate } from 'react-router';
import { cn } from '../ui/utils';

interface DailyMissionCardProps {
  missions: DailyMission[];
}

export function DailyMissionCard({ missions: initialMissions }: DailyMissionCardProps) {
  const navigate = useNavigate();
  const [missions, setMissions] = useState(initialMissions);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const handleComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAction = (mission: DailyMission) => {
    if (mission.type === 'LOW_STOCK' || mission.type === 'EXPIRY') {
      navigate('/dashboard/inventory');
    } else {
      navigate('/dashboard/vendors');
    }
  };

  if (missions.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#0F4C81]/10 shadow-md overflow-hidden mb-6"
    >
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#1E6091] px-6 py-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <CheckCircle2 className="text-white/80" size={20} />
          Today's Missions
        </h2>
        <span className="text-white/80 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
          {missions.length - completedIds.size} remaining
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {missions.map((mission) => {
            const isCompleted = completedIds.has(mission.id);
            return (
              <motion.div
                key={mission.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "p-4 flex items-center gap-4 transition-colors cursor-pointer group",
                  isCompleted ? "bg-gray-50" : "hover:bg-[#F5F9FC]"
                )}
                onClick={() => !isCompleted && handleAction(mission)}
              >
                <button 
                  onClick={(e) => handleComplete(e, mission.id)}
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isCompleted ? "text-green-500" : "text-gray-300 hover:text-[#0F4C81]"
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-semibold text-[#082032] flex items-center gap-2",
                    isCompleted && "text-gray-400 line-through"
                  )}>
                    {mission.title}
                    {mission.priority === 'HIGH' && !isCompleted && (
                      <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                        <AlertOctagon size={10} /> Urgent
                      </span>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm text-gray-500 truncate",
                    isCompleted && "text-gray-300"
                  )}>
                    {mission.description}
                  </p>
                </div>

                {!isCompleted && (
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81]">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
