import React, { useEffect, useState } from 'react';
import { useWalletStore } from '../stores/walletStore';
import Card from '../components/Card';
import Button from '../components/Button';
import TransactionItem from '../components/TransactionItem';
import { Send, Plus, CreditCard, Copy } from 'lucide-react';

const Wallet: React.FC = () => {
  const { balance, transactions, loadBalance, loadTransactions, transfer, isLoading } = useWalletStore();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadBalance();
    loadTransactions();
  }, [loadBalance, loadTransactions]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;
    await transfer(parseFloat(amount), recipient);
    setRecipient('');
    setAmount('');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in pt-16 md:pt-8">
       <header className="animate-slide-up">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wallet</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card - Enhanced UI */}
        <div className="bg-slate-900 dark:bg-black rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none animate-slide-up [animation-delay:100ms] group hover:scale-[1.01] transition-transform duration-300">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 p-40 bg-fintech-600 rounded-full blur-[80px] opacity-30 -mr-20 -mt-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-purple-600 rounded-full blur-[60px] opacity-20 -ml-10 -mb-10 group-hover:opacity-30 transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-sm font-medium tracking-wide">AVAILABLE BALANCE</p>
                        <h2 className="text-4xl font-bold mt-2 tracking-tight">
                            {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </h2>
                    </div>
                    <CreditCard size={32} className="text-slate-400" />
                </div>

                <div className="mt-8">
                     <div className="flex items-center gap-2 mb-6">
                        <span className="text-slate-400 font-mono text-sm">**** **** **** 4288</span>
                        <button className="text-slate-500 hover:text-white transition-colors"><Copy size={14}/></button>
                     </div>
                    <div className="flex gap-3">
                        <Button variant="primary" className="flex-1 bg-white text-slate-900 hover:bg-slate-100 hover:shadow-lg border-0">
                            <Plus size={16} className="mr-2"/> Add Money
                        </Button>
                        <Button variant="secondary" className="flex-1 bg-white/10 text-white border-white/10 hover:bg-white/20 backdrop-blur-md">
                            Details
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Transfer Form */}
        <div className="animate-slide-up [animation-delay:200ms]">
            <Card title="Quick Transfer" className="h-full">
                <form onSubmit={handleTransfer} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Recipient ID or Email</label>
                        <input 
                            type="text" 
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-fintech-500 focus:border-transparent focus:outline-none transition-all"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">$</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-fintech-500 focus:border-transparent focus:outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <Button type="submit" isLoading={isLoading} className="w-full py-3 text-base shadow-lg shadow-fintech-600/20">
                        <Send size={18} className="mr-2"/> Send Money
                    </Button>
                </form>
            </Card>
        </div>
      </div>

      <div className="animate-slide-up [animation-delay:300ms]">
        <Card title="Transaction History">
            <div className="space-y-1">
                {transactions.map(tx => (
                    <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;