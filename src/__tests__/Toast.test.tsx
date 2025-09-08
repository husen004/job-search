import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toast from '../components/Toast';

test('renders Toast component', () => {
  render(<Toast />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});