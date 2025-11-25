import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag } from 'lucide-react';

interface Props {
  transaction: Transaction;
}

const TransactionItem: React.FC<Props> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const isPending = transaction.status === 'pending';

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors px-3 rounded-lg -mx-3 group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full transition-colors ${
          isIncome 
            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700'
        }`}>
          {isIncome ? <ArrowDownLeft size={18} /> : (transaction.recipient.includes('Store') ? <ShoppingBag size={18}/> : <ArrowUpRight size={18} />)}
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{transaction.recipientName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
          {isIncome ? '+' : ''}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
        <p className={`text-xs capitalize ${isPending ? 'text-amber-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
          {transaction.status}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;