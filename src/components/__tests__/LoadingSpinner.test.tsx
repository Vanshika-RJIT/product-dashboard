import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders loading text', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('has accessible loading indicator', () => {
    render(<LoadingSpinner />);
    
    const srOnly = screen.getByText('Loading...');
    expect(srOnly).toHaveClass('sr-only');
  });
});
