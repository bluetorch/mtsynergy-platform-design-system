import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['NEW', 'ASSIGNED', 'RESOLVED', 'SPAM'],
      description: 'Badge status type',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Badge size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const New: Story = {
  args: {
    status: 'NEW',
    children: 'New',
  },
};

export const Assigned: Story = {
  args: {
    status: 'ASSIGNED',
    children: 'Assigned',
  },
};

export const Resolved: Story = {
  args: {
    status: 'RESOLVED',
    children: 'Resolved',
  },
};

export const Spam: Story = {
  args: {
    status: 'SPAM',
    children: 'Spam',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="mts-flex mts-gap-4 mts-flex-wrap">
      <Badge status="NEW">New</Badge>
      <Badge status="ASSIGNED">Assigned</Badge>
      <Badge status="RESOLVED">Resolved</Badge>
      <Badge status="SPAM">Spam</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="mts-flex mts-gap-4 mts-items-center mts-flex-wrap">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div className="mts-grid mts-grid-cols-4 mts-gap-4">
      <Badge status="NEW" size="sm">
        NEW/sm
      </Badge>
      <Badge status="NEW" size="md">
        NEW/md
      </Badge>
      <Badge status="ASSIGNED" size="sm">
        ASSIGNED/sm
      </Badge>
      <Badge status="ASSIGNED" size="md">
        ASSIGNED/md
      </Badge>
      <Badge status="RESOLVED" size="sm">
        RESOLVED/sm
      </Badge>
      <Badge status="RESOLVED" size="md">
        RESOLVED/md
      </Badge>
      <Badge status="SPAM" size="sm">
        SPAM/sm
      </Badge>
      <Badge status="SPAM" size="md">
        SPAM/md
      </Badge>
    </div>
  ),
};
