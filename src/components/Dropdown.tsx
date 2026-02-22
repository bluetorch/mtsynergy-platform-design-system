import React from 'react';
import { Menu, Transition } from '@headlessui/react';

type DropdownAlign = 'left' | 'right';

interface DropdownItem {
  label: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: DropdownAlign;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className,
}) => {
  const alignClass = align === 'right' ? 'mts-right-0' : 'mts-left-0';

  return (
    <Menu as="div" className={`mts-relative mts-inline-block mts-text-left ${className || ''}`}>
      <Menu.Button className="mts-flex mts-items-center">{trigger}</Menu.Button>

      <Transition
        as={React.Fragment}
        enter="mts-transition mts-ease-out mts-duration-100"
        enterFrom="mts-transform mts-opacity-0 mts-scale-95"
        enterTo="mts-transform mts-opacity-100 mts-scale-100"
        leave="mts-transition mts-ease-in mts-duration-75"
        leaveFrom="mts-transform mts-opacity-100 mts-scale-100"
        leaveTo="mts-transform mts-opacity-0 mts-scale-95"
      >
        <Menu.Items
          className={`${alignClass} mts-z-50 mts-absolute mts-mt-2 mts-w-56 mts-origin-top mts-rounded-lg mts-bg-white mts-shadow-lg mts-ring-1 mts-ring-secondary-200 mts-focus:outline-none mts-divide-y mts-divide-secondary-100`}
        >
          {items.map((item, index) => (
            <Menu.Item key={index} disabled={item.disabled || false}>
              {({ active }) => (
                <button
                  onClick={item.onClick}
                  disabled={item.disabled || false}
                  className={`${
                    active
                      ? item.variant === 'danger'
                        ? 'mts-bg-danger-50 mts-text-danger-700'
                        : 'mts-bg-primary-50 mts-text-primary-700'
                      : item.variant === 'danger'
                        ? 'mts-text-danger-600'
                        : 'mts-text-secondary-700'
                  } ${
                    item.disabled
                      ? 'mts-opacity-50 mts-cursor-not-allowed'
                      : 'hover:mts-bg-secondary-50'
                  } mts-group mts-flex mts-w-full mts-items-center mts-gap-3 mts-px-4 mts-py-2 mts-text-sm mts-transition-colors`}
                >
                  {item.icon && <span className="mts-flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
