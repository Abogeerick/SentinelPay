import { Transaction } from '../types';

export const mockBalance = 12450.75;

export const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    amount: -120.00,
    recipient: 'Store_ABC',
    recipientName: 'Main St Grocers',
    date: '2023-10-25T14:30:00Z',
    type: 'payment',
    status: 'completed',
  },
  {
    id: 'tx_2',
    amount: -500.00,
    recipient: 'Alice_Smith',
    recipientName: 'Alice Smith',
    date: '2023-10-24T09:15:00Z',
    type: 'transfer',
    status: 'completed',
  },
  {
    id: 'tx_3',
    amount: 3200.00,
    recipient: 'Employer_Inc',
    recipientName: 'Tech Corp Salary',
    date: '2023-10-20T08:00:00Z',
    type: 'income',
    status: 'completed',
  },
  {
    id: 'tx_4',
    amount: -45.99,
    recipient: 'Sub_Netflix',
    recipientName: 'Streaming Service',
    date: '2023-10-18T19:00:00Z',
    type: 'payment',
    status: 'completed',
  },
  {
    id: 'tx_5',
    amount: -999.00,
    recipient: 'Unknown_Merch',
    recipientName: 'Electronics Hub',
    date: '2023-10-15T12:00:00Z',
    type: 'payment',
    status: 'pending',
  },
];