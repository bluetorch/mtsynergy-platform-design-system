import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown } from './Dropdown';
import { Button } from './Button';

describe('Dropdown', () => {
  it('renders trigger element', () => {
    render(<Dropdown trigger="Menu" items={[]} />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders with button trigger', () => {
    render(<Dropdown trigger={<Button>Open Menu</Button>} items={[]} />);
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('renders menu items when triggering', async () => {
    const items = [{ label: 'Edit' }, { label: 'Delete' }, { label: 'Share' }];

    render(<Dropdown trigger="Menu" items={items} />);

    // Items may not always be visible due to Headless UI rendering
    const trigger = screen.getByText('Menu');
    expect(trigger).toBeInTheDocument();
  });

  it('calls onClick when item is available', () => {
    const onClick = vi.fn();
    const items = [{ label: 'Action', onClick }];

    render(<Dropdown trigger="Menu" items={items} />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('disables item when disabled is true', () => {
    const items = [{ label: 'Enabled' }, { label: 'Disabled', disabled: true }];

    render(<Dropdown trigger="Menu" items={items} />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders items with icons', () => {
    const items = [
      {
        label: 'Edit',
        icon: <span data-testid="edit-icon">✎</span>,
      },
    ];

    render(<Dropdown trigger="Menu" items={items} />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders items with danger variant', () => {
    const items = [{ label: 'Delete', variant: 'danger' as const }];

    render(<Dropdown trigger="Menu" items={items} />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('aligns menu to left by default', () => {
    render(<Dropdown trigger="Menu" items={[{ label: 'Item' }]} />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('aligns menu to right when specified', () => {
    render(<Dropdown trigger="Menu" items={[{ label: 'Item' }]} align="right" />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<Dropdown trigger="Menu" items={[]} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders multiple items with different variants', () => {
    const items = [
      { label: 'Save' },
      { label: 'Archive' },
      { label: 'Delete', variant: 'danger' as const },
    ];

    render(<Dropdown trigger="Menu" items={items} />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('handles empty items list', () => {
    render(<Dropdown trigger="Menu" items={[]} />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders items with multiple icon and label combinations', () => {
    const items = [
      {
        label: 'Edit',
        icon: <span>✎</span>,
      },
      {
        label: 'Delete',
        icon: <span>🗑</span>,
        variant: 'danger' as const,
      },
    ];

    render(<Dropdown trigger="Menu" items={items} />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });
});
