import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
      description: 'Alert variant/type',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

const DismissibleComponent = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(true);
  return isVisible ? (
    <Alert dismissible onDismiss={() => setIsVisible(false)}>
      This alert can be dismissed.
    </Alert>
  ) : null;
};

const DismissibleSuccessComponent = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(true);
  return isVisible ? (
    <Alert variant="success" dismissible onDismiss={() => setIsVisible(false)}>
      Success message that can be dismissed.
    </Alert>
  ) : null;
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational message.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Operation completed successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Please be careful with this action.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'An error occurred. Please try again.',
  },
};

export const Dismissible: Story = {
  render: () => <DismissibleComponent />,
};

export const DismissibleSuccess: Story = {
  render: () => <DismissibleSuccessComponent />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="mts-space-y-4">
      <Alert variant="info">
        <strong>Info:</strong> This is an informational alert.
      </Alert>
      <Alert variant="success">
        <strong>Success:</strong> Operation completed successfully.
      </Alert>
      <Alert variant="warning">
        <strong>Warning:</strong> Please review this carefully.
      </Alert>
      <Alert variant="error">
        <strong>Error:</strong> Something went wrong.
      </Alert>
    </div>
  ),
};

export const WithTitle: Story = {
  args: {
    variant: 'info',
    children: (
      <div>
        <h4 className="mts-font-semibold mts-mb-1">Alert Title</h4>
        <p>This is the alert description text.</p>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    variant: 'warning',
    children: (
      <div>
        <h4 className="mts-font-semibold mts-mb-2">Warning: Database Migration</h4>
        <p className="mts-mb-2">
          This operation will modify the database schema. Please ensure you have a backup before
          proceeding.
        </p>
        <p>Estimated time: 5-10 minutes</p>
      </div>
    ),
  },
};
