import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyForm5 from './MyForm5';

describe('MyForm5 Component', () => {
  test('renders form elements correctly', () => {
    render(<MyForm5 />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows validation error for empty name field', async () => {
    render(<MyForm5 />);
    fireEvent.blur(screen.getByLabelText(/name/i));
    expect(await screen.findByText('Required')).toBeInTheDocument();
  });

  test('shows validation error for empty email field', async () => {
    render(<MyForm5 />);
    fireEvent.blur(screen.getByLabelText(/email/i));
    expect(await screen.findByText('Required')).toBeInTheDocument();
  });

  test('shows validation error for invalid email format', async () => {
    render(<MyForm5 />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@invalid' } });
    fireEvent.blur(emailInput);
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    render(<MyForm5 />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Form data', {
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
    });

    consoleLogSpy.mockRestore();
  });
});
