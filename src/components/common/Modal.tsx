import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#161424]/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidth} bg-[#FFFDF8] dark:bg-[#1E2133] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#D7C9B1] dark:border-[#3C4263] z-10 my-8 max-h-[90vh] overflow-y-auto transition-colors`}
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E0D0] dark:border-[#2D334C]">
              <div>
                <h3 className="font-display italic font-bold text-2xl text-[#5A4688] dark:text-[#E2D9FC] tracking-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#FAF6EE] dark:hover:bg-[#282C44] active:scale-95 text-[#735A46] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="pt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
