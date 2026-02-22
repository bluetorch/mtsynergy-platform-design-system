import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders with children', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('has role alert', () => {
    const { container } = render(<Alert>Alert</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it('renders with default variant info', () => {
    const { container } = render(<Alert>Info alert</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('mts-bg-info-50', 'mts-border-info-200', 'mts-text-info-800');
  });

  it('renders with variant success', () => {
    const { container } = render(<Alert variant="success">Success alert</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass(
      'mts-bg-success-50',
      'mts-border-success-200',
      'mts-text-success-800'
    );
  });

  it('renders with variant warning', () => {
    const { container } = render(<Alert variant="warning">Warning alert</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass(
      'mts-bg-warning-50',
      'mts-border-warning-200',
      'mts-text-warning-800'
    );
  });

  it('renders with variant error', () => {
    const { container } = render(<Alert variant="error">Error alert</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('mts-bg-danger-50', 'mts-border-danger-200', 'mts-text-danger-800');
  });

  it('does not render close button by default', () => {
    render(<Alert>Alert</Alert>);
    expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
  });

  it('renders close button when dismissible is true', () => {
    render(<Alert dismissible>Alert</Alert>);
    expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Alert
      </Alert>
    );

    await user.click(screen.getByLabelText('Close alert'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('renders all base styles', () => {
    const { container } = render(<Alert>Alert</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass(
      'mts-flex',
      'mts-items-start',
      'mts-rounded-lg',
      'mts-border',
      'mts-p-4',
      'mts-gap-3'
    );
  });

  it('accepts custom className', () => {
    const { container } = render(<Alert className="custom-class">Alert</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('custom-class');
  });

  it('accepts HTML attributes', () => {
    render(<Alert data-testid="custom-alert">Alert</Alert>);
    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <Alert>
        <h3>Alert Title</h3>
        <p>Alert description</p>
      </Alert>
    );
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description')).toBeInTheDocument();
  });

  it('renders icon for each variant', () => {
    const { container: successContainer } = render(<Alert variant="success">Alert</Alert>);
    expect(successContainer.querySelector('svg')).toBeInTheDocument();

    const { container: warningContainer } = render(<Alert variant="warning">Alert</Alert>);
    expect(warningContainer.querySelector('svg')).toBeInTheDocument();

    const { container: errorContainer } = render(<Alert variant="error">Alert</Alert>);
    expect(errorContainer.querySelector('svg')).toBeInTheDocument();

    const { container: infoContainer } = render(<Alert variant="info">Alert</Alert>);
    expect(infoContainer.querySelector('svg')).toBeInTheDocument();
  });

  it('does not call onDismiss if not provided and dismissible is true', async () => {
    const user = userEvent.setup();
    const { container } = render(<Alert dismissible>Alert</Alert>);
    const closeButton = screen.getByLabelText('Close alert');
    await user.click(closeButton);
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
  });

  it('allows dismissing multiple times consecutively', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(
      <Alert key="1" dismissible onDismiss={onDismiss}>
        Alert
      </Alert>
    );

    await user.click(screen.getByLabelText('Close alert'));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    rerender(
      <Alert key="2" dismissible onDismiss={onDismiss}>
        Alert 2
      </Alert>
    );

    await user.click(screen.getByLabelText('Close alert'));
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});
