import { TextEncoder } from 'text-encoding';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// eslint-disable-next-line no-undef
jest.mock('./src/constants/constants', () => ({
  SERVER_HOST: 'http://localhost:3001',
  isServer: false,
}));

global.TextEncoder = TextEncoder;
