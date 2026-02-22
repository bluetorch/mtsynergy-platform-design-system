import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with children', () => {
    render(<Badge>New Issue</Badge>);
    expect(screen.getByText('New Issue')).toBeInTheDocument();
  });

  it('renders with default status NEW', () => {
    const { container } = render(<Badge>Status</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('mts-bg-info-100', 'mts-text-info-700', 'mts-border-info-200');
  });

  it('renders with status ASSIGNED', () => {
    const { container } = render(<Badge status="ASSIGNED">Assigned</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass(
      'mts-bg-warning-100',
      'mts-text-warning-700',
      'mts-border-warning-200'
    );
  });

  it('renders with status RESOLVED', () => {
    const { container } = render(<Badge status="RESOLVED">Resolved</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass(
      'mts-bg-success-100',
      'mts-text-success-700',
      'mts-border-success-200'
    );
  });

  it('renders with status SPAM', () => {
    const { container } = render(<Badge status="SPAM">Spam</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('mts-bg-danger-100', 'mts-text-danger-700', 'mts-border-danger-200');
  });

  it('renders with default size sm', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('mts-px-2', 'mts-py-1', 'mts-text-xs');
  });

  it('renders with size md', () => {
    const { container } = render(<Badge size="md">Badge</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('mts-px-3', 'mts-py-1', 'mts-text-sm');
  });

  it('renders with all base styles', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass(
      'mts-inline-flex',
      'mts-items-center',
      'mts-rounded-full',
      'mts-border'
    );
  });

  it('accepts custom className', () => {
    const { container } = render(<Badge className="mts-custom-class">Badge</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('mts-custom-class');
  });

  it('accepts HTML attributes', () => {
    render(<Badge data-testid="custom-badge">Badge</Badge>);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });

  it('renders as span element', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.querySelector('span');
    expect(badge?.tagName).toBe('SPAN');
  });

  it('supports multiple statuses in list', () => {
    render(
      <div>
        <Badge status="NEW">New</Badge>
        <Badge status="ASSIGNED">Assigned</Badge>
        <Badge status="RESOLVED">Resolved</Badge>
        <Badge status="SPAM">Spam</Badge>
      </div>
    );
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Assigned')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
    expect(screen.getByText('Spam')).toBeInTheDocument();
  });

  it('combines status and size classes correctly', () => {
    const { container } = render(
      <Badge status="RESOLVED" size="md">
        Fixed
      </Badge>
    );
    const badge = container.querySelector('span');
    expect(badge).toHaveClass(
      'mts-bg-success-100',
      'mts-text-success-700',
      'mts-border-success-200',
      'mts-px-3',
      'mts-py-1',
      'mts-text-sm'
    );
  });

  it('renders complex children', () => {
    render(
      <Badge>
        <span>Issue</span> #123
      </Badge>
    );
    expect(screen.getByText('Issue')).toBeInTheDocument();
    expect(screen.getByText('#123')).toBeInTheDocument();
  });
});
