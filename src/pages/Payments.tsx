import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import TransactionItem from '../components/TransactionItem';
import api from '../services/api';
import { ShoppingCart, CheckCircle, History } from 'lucide-react';
import { Transaction } from '../types';

const Payments: React.FC = () => {
  const [step, setStep] = useState<'cart' | 'processing' | 'success'>('cart');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [reason, setReason] = useState('');
  const [paymentHistory, setPaymentHistory] = useState<Transaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await api.get('/payments/history');
      setPaymentHistory(res.data);
    } catch (err) {
      console.error('Failed to load payment history', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient || !reason) return;
    
    setStep('processing');
    try {
        await api.post('/payments/checkout', { amount: parseFloat(amount), recipient, reason });
        setTimeout(() => {
          setStep('success');
          // Reset form
          setAmount('');
          setRecipient('');
          setReason('');
          // Reload history
          loadPaymentHistory();
        }, 1500);
    } catch (e) {
        setStep('cart');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pt-16 md:pt-8 animate-fade-in">
      <header className="animate-slide-up">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
        <p className="text-slate-500 dark:text-slate-400">Make payments and view your transaction history.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checkout Form */}
        <div className="animate-slide-up [animation-delay:100ms]">
          {step === 'cart' && (
            <Card title="New Payment">
              <form onSubmit={handleCheckout} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-fintech-500 focus:border-transparent focus:outline-none transition-all"
                      placeholder="0.00"
                      required
                      min="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Recipient
                  </label>
                  <input 
                    type="text" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-fintech-500 focus:border-transparent focus:outline-none transition-all"
                    placeholder="Recipient name or email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Reason / Description
                  </label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-fintech-500 focus:border-transparent focus:outline-none transition-all resize-none"
                    placeholder="Payment reason or description"
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" className="w-full py-3 text-base shadow-lg shadow-fintech-600/20">
                  <ShoppingCart size={18} className="mr-2" />
                  Confirm Payment
                </Button>
              </form>
            </Card>
          )}

          {step === 'processing' && (
            <div className="animate-fade-in">
              <Card className="text-center py-20">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-fintech-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Processing Payment...</h3>
                <p className="text-slate-500 dark:text-slate-400">Securely contacting the gateway.</p>
              </Card>
            </div>
          )}

          {step === 'success' && (
            <div className="animate-slide-up">
              <Card className="text-center py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                  Transaction ID: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">#TX-999-SENT</span>
                </p>
                <Button onClick={() => setStep('cart')} variant="secondary" className="px-8">
                  Make Another Payment
                </Button>
              </Card>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="animate-slide-up [animation-delay:200ms]">
          <Card title="Payment History" className="h-full">
            <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
              <History size={16} />
              <span className="text-sm">Recent payment transactions</span>
            </div>
            {isLoadingHistory ? (
              <div className="text-center py-8 text-slate-400">Loading history...</div>
            ) : (
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map(tx => (
                    <TransactionItem key={tx.id} transaction={tx} />
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-8">No payment history yet.</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payments;