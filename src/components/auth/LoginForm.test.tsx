import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { LoginForm } from './LoginForm';
import { supabase } from '../../lib/supabase';
import { vi } from 'vitest';

// Mock supabase auth
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn()
    }
  }
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ error: null });
    (supabase.auth.signInWithPassword as any) = mockSignIn;

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('handles login error', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      error: { message: 'Invalid credentials' }
    });
    (supabase.auth.signInWithPassword as any) = mockSignIn;

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows loading state during login', async () => {
    const mockSignIn = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    (supabase.auth.signInWithPassword as any) = mockSignIn;

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(submitButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
}); 