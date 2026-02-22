import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Modal width size',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Allow closing with ESC key',
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Allow closing by clicking outside',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const BasicModal = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Basic Modal">
        <p>This is a basic modal dialog.</p>
      </Modal>
    </>
  );
};

const WithFooterModal = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        footer={
          <div className="mts-flex mts-gap-3 mts-justify-end">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </div>
        }
      >
        <p>Are you sure you want to proceed with this action?</p>
      </Modal>
    </>
  );
};

const SmallModal = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Small Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Small Modal" size="sm">
        <p>This is a small modal.</p>
      </Modal>
    </>
  );
};

const LargeModal = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Large Modal" size="lg">
        <p>This is a large modal with more content space.</p>
      </Modal>
    </>
  );
};

const WithFormModal = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New Item"
        footer={
          <div className="mts-flex mts-gap-3 mts-justify-end">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Create</Button>
          </div>
        }
      >
        <form className="mts-space-y-4">
          <div>
            <label className="mts-block mts-text-sm mts-font-medium mts-text-secondary-700 mts-mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="mts-w-full mts-px-3 mts-py-2 mts-border mts-border-secondary-300 mts-rounded-lg"
            />
          </div>
          <div>
            <label className="mts-block mts-text-sm mts-font-medium mts-text-secondary-700 mts-mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              className="mts-w-full mts-px-3 mts-py-2 mts-border mts-border-secondary-300 mts-rounded-lg"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

const NoTitleModal = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal Without Title</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mts-text-center">
          <h3 className="mts-text-lg mts-font-semibold mts-mb-2">No Title Modal</h3>
          <p>This modal has no header title.</p>
        </div>
      </Modal>
    </>
  );
};

const AllSizesModal = (): JSX.Element => {
  const [openSize, setOpenSize] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null);
  return (
    <>
      <div className="mts-flex mts-gap-2">
        <Button onClick={() => setOpenSize('sm')}>Small</Button>
        <Button onClick={() => setOpenSize('md')}>Medium</Button>
        <Button onClick={() => setOpenSize('lg')}>Large</Button>
        <Button onClick={() => setOpenSize('xl')}>XLarge</Button>
      </div>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Modal
          key={size}
          isOpen={openSize === size}
          onClose={() => setOpenSize(null)}
          title={`${size.toUpperCase()} Modal`}
          size={size}
        >
          <p>This is a {size} sized modal.</p>
        </Modal>
      ))}
    </>
  );
};

export const Basic: Story = {
  render: () => <BasicModal />,
};

export const WithFooter: Story = {
  render: () => <WithFooterModal />,
};

export const Small: Story = {
  render: () => <SmallModal />,
};

export const Large: Story = {
  render: () => <LargeModal />,
};

export const WithForm: Story = {
  render: () => <WithFormModal />,
};

export const NoTitle: Story = {
  render: () => <NoTitleModal />,
};

export const AllSizes: Story = {
  render: () => <AllSizesModal />,
};
