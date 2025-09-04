'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { Achievement, getAchievementStyle } from '@/lib/achievements';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // 5초 후 자동으로 닫기
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // 애니메이션 완료 후 제거
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const style = getAchievementStyle(achievement.rarity);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`
            relative overflow-hidden rounded-xl border-2 p-4
            ${style.border} ${style.bg} ${style.glow}
            backdrop-blur-sm shadow-xl
          `}>
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full bg-gradient-to-br from-transparent via-white to-transparent" />
            </div>
            
            {/* 닫기 버튼 */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* 메인 콘텐츠 */}
            <div className="flex items-start gap-3">
              {/* 트로피 아이콘 */}
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex-shrink-0"
              >
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                  <Trophy className="w-6 h-6" />
                </div>
              </motion.div>

              {/* 텍스트 내용 */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold text-sm ${style.text}`}>
                      달성과제 획득!
                    </h3>
                    <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      <span>+{achievement.xpReward} XP</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl" role="img" aria-label={achievement.name}>
                      {achievement.icon}
                    </span>
                    <h4 className={`font-semibold text-base ${style.text}`}>
                      {achievement.name}
                    </h4>
                    <span className={`
                      px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                        achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }
                    `}>
                      {achievement.rarity}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${style.text} opacity-80`}>
                    {achievement.description}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* 진행률 바 애니메이션 */}
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 4.5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}