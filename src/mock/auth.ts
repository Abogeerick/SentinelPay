import { User } from '../types';

export const mockUser: User = {
  id: 'usr_123',
  name: 'Alex Sentinel',
  email: 'alex@sentinelpay.io',
  avatar: 'https://picsum.photos/100/100',
};

export const loginResponse = {
  token: 'mock_jwt_token_xy789',
  user: mockUser,
};