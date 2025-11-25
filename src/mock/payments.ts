import { Transaction } from '../types';

export const mockPaymentHistory: Transaction[] = [
  {
    id: 'pay_1',
    amount: -129.99,
    recipient: 'Premium_Plan',
    recipientName: 'SentinelPay Premium Subscription',
    date: '2023-10-26T10:30:00Z',
    type: 'payment',
    status: 'completed',
  },
  {
    id: 'pay_2',
    amount: -45.99,
    recipient: 'Streaming_Service',
    recipientName: 'Streaming Service Monthly',
    date: '2023-10-20T14:15:00Z',
    type: 'payment',
    status: 'completed',
  },
  {
    id: 'pay_3',
    amount: -299.00,
    recipient: 'Electronics_Store',
    recipientName: 'Electronics Hub Purchase',
    date: '2023-10-15T09:00:00Z',
    type: 'payment',
    status: 'completed',
  },
  {
    id: 'pay_4',
    amount: -19.99,
    recipient: 'Cloud_Storage',
    recipientName: 'Cloud Storage Plan',
    date: '2023-10-10T16:45:00Z',
    type: 'payment',
    status: 'completed',
  },
  {
    id: 'pay_5',
    amount: -89.50,
    recipient: 'Online_Course',
    recipientName: 'Tech Course Enrollment',
    date: '2023-10-05T11:20:00Z',
    type: 'payment',
    status: 'completed',
  },
];

