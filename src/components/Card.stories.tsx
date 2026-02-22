import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Internal padding size',
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Shadow depth',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'Card content goes here',
  },
};

export const WithTitle: Story = {
  render: (args) => (
    <Card {...args}>
      <h3 className="mts-text-lg mts-font-semibold mts-mb-2">Card Title</h3>
      <p className="mts-text-secondary-600">Card content goes here</p>
    </Card>
  ),
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: 'Small padding card',
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: 'Large padding card',
  },
};

export const NoShadow: Story = {
  args: {
    shadow: 'none',
    children: 'Card without shadow',
  },
};

export const LargeShadow: Story = {
  args: {
    shadow: 'lg',
    children: 'Card with large shadow',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="mts-grid mts-grid-cols-2 mts-gap-4">
      <Card padding="sm" shadow="sm">
        Small/Small
      </Card>
      <Card padding="md" shadow="md">
        Medium/Medium
      </Card>
      <Card padding="lg" shadow="lg">
        Large/Large
      </Card>
      <Card padding="none" shadow="none">
        None/None
      </Card>
    </div>
  ),
};
