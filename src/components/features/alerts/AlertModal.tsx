import React, { useState } from 'react';
import { X, Bell, Mail, Phone } from 'lucide-react';
import { Button } from '../../ui/Button';
import { goldApi } from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, currentCity }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [purity, setPurity] = useState('22K');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setStatus({ type: 'error', message: 'Please provide either an email or a phone number.' });
      return;
    }

    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setStatus({ type: 'error', message: 'Please enter a valid target price.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await goldApi.createAlert({
        email: email || undefined,
        phone: phone || undefined,
        city: currentCity,
        targetPrice: priceNum,
        purity,
      });

      setStatus({ type: 'success', message: res.message });
      setTimeout(() => {
        onClose();
        setEmail('');
        setPhone('');
        setTargetPrice('');
        setStatus(null);
      }, 3000);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to setup alert. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative z-10 overflow-hidden border border-slate-100"
          >
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <Bell className="h-5 w-5 fill-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900 tracking-tight">Set Price Alert</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Bullion monitoring in {currentCity}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Purity and Target */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Purity
                  </label>
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-xs text-navy-900 focus:border-amber-400 focus:bg-white focus:outline-none"
                  >
                    <option value="22K">22K Gold</option>
                    <option value="24K">24K Gold</option>
                    <option value="18K">18K Gold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Trigger Price (₹/g)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 6500"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-xs text-navy-900 focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Email Notification
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 pr-3 pl-10 text-xs text-navy-900 focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  SMS Notification
                </label>
                <div className="relative">
                  <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 pr-3 pl-10 text-xs text-navy-900 focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 mt-4 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800"
              >
                {loading ? 'Creating alert...' : 'Activate Alerts'}
              </Button>

              {/* Status report */}
              {status && (
                <div
                  className={`mt-4 rounded-xl p-3 text-xs leading-relaxed font-semibold ${
                    status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      : 'bg-rose-50 text-rose-800 border border-rose-100'
                  }`}
                >
                  {status.message}
                </div>
              )}

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
