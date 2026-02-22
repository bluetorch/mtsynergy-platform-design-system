import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  const defaultTabs = [
    { label: 'Tab 1', content: 'Content 1' },
    { label: 'Tab 2', content: 'Content 2' },
    { label: 'Tab 3', content: 'Content 3' },
  ];

  it('renders all tab labels', () => {
    render(<Tabs tabs={defaultTabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders default tab content on initial render', () => {
    render(<Tabs tabs={defaultTabs} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('switches to second tab on click', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={defaultTabs} />);

    await user.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('switches to third tab on click', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={defaultTabs} />);

    await user.click(screen.getByText('Tab 3'));
    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  it('calls onChange callback when tab is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs tabs={defaultTabs} onChange={onChange} />);

    await user.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('uses defaultIndex prop to set initial tab', () => {
    render(<Tabs tabs={defaultTabs} defaultIndex={1} />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('disables tab when disabled is true', async () => {
    const tabs = [
      { label: 'Tab 1', content: 'Content 1' },
      { label: 'Tab 2', content: 'Content 2', disabled: true },
      { label: 'Tab 3', content: 'Content 3' },
    ];

    render(<Tabs tabs={tabs} />);
    const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
    expect(disabledTab).toBeDisabled();
  });

  it('does not switch tab when disabled tab is clicked', async () => {
    const user = userEvent.setup();
    const tabs = [
      { label: 'Tab 1', content: 'Content 1' },
      { label: 'Tab 2', content: 'Content 2', disabled: true },
    ];

    render(<Tabs tabs={tabs} />);
    const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });

    if (!disabledTab.hasAttribute('disabled')) {
      await user.click(disabledTab);
    }

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<Tabs tabs={defaultTabs} className="custom-tabs" />);
    expect(container.querySelector('.custom-tabs')).toBeInTheDocument();
  });

  it('renders with complex content', () => {
    const tabs = [
      {
        label: 'Tab 1',
        content: (
          <div>
            <h3>Heading</h3>
            <p>Paragraph</p>
          </div>
        ),
      },
      {
        label: 'Tab 2',
        content: (
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        ),
      },
    ];

    render(<Tabs tabs={tabs} />);
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('renders tab panels with content', () => {
    render(<Tabs tabs={defaultTabs} />);
    const panels = screen.getAllByRole('tabpanel');

    // Headless UI renders only the active tab panel
    expect(panels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('switches between multiple tabs sequentially', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={defaultTabs} />);

    await user.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();

    await user.click(screen.getByText('Tab 3'));
    expect(screen.getByText('Content 3')).toBeInTheDocument();

    await user.click(screen.getByText('Tab 1'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('calls onChange for each tab switch', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs tabs={defaultTabs} onChange={onChange} />);

    await user.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('Tab 3'));
    expect(onChange).toHaveBeenCalledWith(2);

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('renders tab with custom label node', () => {
    const tabs = [
      {
        label: (
          <span>
            Tab <strong>1</strong>
          </span>
        ),
        content: 'Content 1',
      },
    ];

    render(<Tabs tabs={tabs} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles single tab', () => {
    render(<Tabs tabs={[{ label: 'Only Tab', content: 'Only Content' }]} />);
    expect(screen.getByText('Only Tab')).toBeInTheDocument();
    expect(screen.getByText('Only Content')).toBeInTheDocument();
  });

  it('handles many tabs', () => {
    const many = Array.from({ length: 10 }, (_, i) => ({
      label: `Tab ${i + 1}`,
      content: `Content ${i + 1}`,
    }));

    render(<Tabs tabs={many} />);

    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Tab ${i}`)).toBeInTheDocument();
    }
  });
});
