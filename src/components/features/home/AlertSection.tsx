import React, { useState } from 'react';
import { Bell, Mail, Phone, RefreshCw } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { goldApi } from '../../../services/api';

interface AlertSectionProps {
  currentCity: string;
}

export const AlertSection: React.FC<AlertSectionProps> = ({ currentCity }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setStatus({ type: 'error', message: 'Please enter an email address or a phone number.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await goldApi.createAlert({
        email: email || undefined,
        phone: phone || undefined,
        city: currentCity,
        targetPrice: 6500, // default target rate if not specified
        purity: '22K',
      });

      setStatus({ type: 'success', message: res.message });
      setEmail('');
      setPhone('');
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to register alert. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="set-alert-section" className="bg-[#e5a80b] py-16 text-navy-900 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Centered White Card */}
        <Card className="border-0 rounded-3xl bg-white p-8 md:p-12 shadow-xl max-w-3xl mx-auto text-center">
          
          {/* Bell Icon Header */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 mb-6">
            <Bell className="h-6 w-6 text-amber-500 fill-amber-500/20" />
          </div>

          {/* Heading and Description */}
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Never Miss a Price Drop
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Get instant alerts for gold price changes in your city
          </p>

          {/* Alert Registration Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-2xl mx-auto">
            
            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-100 bg-slate-50 py-3 pr-4 pl-11 text-xs text-navy-900 placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Phone Input */}
              <div className="relative">
                <Phone className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-100 bg-slate-50 py-3 pr-4 pl-11 text-xs text-navy-900 placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                />
              </div>

            </div>

            {/* Set Alert Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 mt-4 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 hover:translate-y-0 active:scale-98 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Bell className="h-4 w-4 fill-white" />
              )}
              <span>Set Price Alert</span>
            </Button>

            {/* Success/Error Feedback */}
            {status && (
              <div
                className={`mt-4 rounded-xl p-3 text-xs leading-relaxed font-semibold text-left ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                    : 'bg-rose-50 text-rose-800 border border-rose-100'
                }`}
              >
                {status.message}
              </div>
            )}

          </form>

          {/* Divider */}
          <div className="border-t border-slate-100 my-10" />

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div>
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wide">Instant Alerts</h4>
              <p className="text-[11px] text-slate-400 mt-1">Get notified within minutes</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wide">Free Service</h4>
              <p className="text-[11px] text-slate-400 mt-1">No charges, no spam</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wide">Customizable</h4>
              <p className="text-[11px] text-slate-400 mt-1">Set your preferred threshold</p>
            </div>

          </div>

        </Card>

      </div>
    </section>
  );
};
