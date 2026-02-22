import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Spinner size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="mts-flex mts-items-center mts-gap-4">
      <div className="mts-flex mts-flex-col mts-items-center mts-gap-2">
        <Spinner size="sm" />
        <span className="mts-text-sm">Small</span>
      </div>
      <div className="mts-flex mts-flex-col mts-items-center mts-gap-2">
        <Spinner size="md" />
        <span className="mts-text-sm">Medium</span>
      </div>
      <div className="mts-flex mts-flex-col mts-items-center mts-gap-2">
        <Spinner size="lg" />
        <span className="mts-text-sm">Large</span>
      </div>
    </div>
  ),
};

export const WithCustomColor: Story = {
  render: () => (
    <div className="mts-flex mts-gap-4">
      <Spinner className="mts-text-primary-500" />
      <Spinner className="mts-text-success-500" />
      <Spinner className="mts-text-danger-500" />
    </div>
  ),
};
