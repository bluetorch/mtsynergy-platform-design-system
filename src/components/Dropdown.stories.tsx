import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Button } from './Button';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Menu alignment',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Basic: Story = {
  args: {
    trigger: <Button>Menu</Button>,
    items: [{ label: 'Edit' }, { label: 'Copy' }, { label: 'Delete' }],
  },
};

export const WithIcons: Story = {
  args: {
    trigger: <Button>Actions</Button>,
    items: [
      {
        label: 'Edit',
        icon: '✎',
      },
      {
        label: 'Download',
        icon: '↓',
      },
      {
        label: 'Share',
        icon: '↗',
      },
    ],
  },
};

export const WithDangerItem: Story = {
  args: {
    trigger: <Button>Options</Button>,
    items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Delete', variant: 'danger' }],
  },
};

export const WithDisabledItems: Story = {
  args: {
    trigger: <Button>Menu</Button>,
    items: [
      { label: 'Save' },
      { label: 'Archive', disabled: true },
      { label: 'Delete', variant: 'danger' },
    ],
  },
};

export const RightAlign: Story = {
  args: {
    trigger: <Button>Menu</Button>,
    items: [{ label: 'Profile' }, { label: 'Settings' }, { label: 'Logout' }],
    align: 'right',
  },
};

const WithCallbacksComponent = (): JSX.Element => {
  const handleEdit = () => alert('Edit clicked');
  const handleDelete = () => alert('Delete clicked');

  return (
    <Dropdown
      trigger={<Button>Actions</Button>}
      items={[
        { label: 'Edit', onClick: handleEdit },
        { label: 'Delete', onClick: handleDelete, variant: 'danger' },
      ]}
    />
  );
};

export const WithCallbacks: Story = {
  render: () => <WithCallbacksComponent />,
};

const ComplexItemsComponent = (): JSX.Element => {
  return (
    <Dropdown
      trigger={<Button>File Menu</Button>}
      items={[
        {
          label: 'New',
          onClick: () => alert('New file'),
          icon: '📄',
        },
        {
          label: 'Open',
          onClick: () => alert('Open file'),
          icon: '📂',
        },
        {
          label: 'Save',
          onClick: () => alert('Save file'),
          icon: '💾',
        },
        {
          label: 'Export',
          onClick: () => alert('Export file'),
          icon: '↗',
        },
        {
          label: 'Delete',
          onClick: () => alert('Delete file'),
          icon: '🗑',
          variant: 'danger',
        },
      ]}
    />
  );
};

export const ComplexItems: Story = {
  render: () => <ComplexItemsComponent />,
};

const AllStatesComponent = (): JSX.Element => {
  return (
    <div className="mts-space-y-4">
      <div>
        <h4 className="mts-text-sm mts-font-semibold mts-mb-2">With Icons</h4>
        <Dropdown
          trigger={<Button>Menu</Button>}
          items={[
            { label: 'Edit', icon: '✎' },
            { label: 'Copy', icon: '📋' },
            { label: 'Delete', icon: '🗑', variant: 'danger' },
          ]}
        />
      </div>
      <div>
        <h4 className="mts-text-sm mts-font-semibold mts-mb-2">With Disabled</h4>
        <Dropdown
          trigger={<Button variant="secondary">Menu</Button>}
          items={[
            { label: 'Available' },
            { label: 'Unavailable', disabled: true },
            { label: 'Delete', variant: 'danger' },
          ]}
        />
      </div>
      <div>
        <h4 className="mts-text-sm mts-font-semibold mts-mb-2">Right Aligned</h4>
        <div className="mts-text-right">
          <Dropdown
            trigger={<Button>Menu</Button>}
            items={[{ label: 'Action 1' }, { label: 'Action 2' }]}
            align="right"
          />
        </div>
      </div>
    </div>
  );
};

export const AllStates: Story = {
  render: () => <AllStatesComponent />,
};
