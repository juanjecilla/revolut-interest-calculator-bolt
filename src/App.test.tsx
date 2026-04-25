import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the page title', () => {
    render(<App />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toMatch(/Revolut Subscription Calculator/i);
  });

  it('renders all 5 plan card headings', () => {
    render(<App />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    const planNames = headings.map((h) => h.textContent);
    expect(planNames).toContain('Standard');
    expect(planNames).toContain('Plus');
    expect(planNames).toContain('Premium');
    expect(planNames).toContain('Metal');
    expect(planNames).toContain('Ultra');
  });

  it('renders the amount input with default value', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(10000);
  });

  it('updates best plan banner when amount changes to very high', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '1000000' } });
    const banner = screen.getByRole('heading', { level: 2 });
    expect(banner.textContent).toMatch(/Ultra/);
  });

  it('shows Standard as best plan at zero investment', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '0' } });
    const banner = screen.getByRole('heading', { level: 2 });
    expect(banner.textContent).toMatch(/Standard/);
  });

  it('renders the comparison chart', () => {
    render(<App />);
    expect(screen.getByText('Plan Comparison Chart')).toBeInTheDocument();
  });

  it('renders Ko-fi support link', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /Support this project on Ko-fi/i });
    expect(link).toHaveAttribute('href', 'https://ko-fi.com/juanjecilla');
  });
});
