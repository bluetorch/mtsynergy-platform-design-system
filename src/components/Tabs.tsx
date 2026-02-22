import React from 'react';
import { Tab } from '@headlessui/react';

interface TabItem {
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0, onChange, className }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(defaultIndex);

  const handleChange = (index: number) => {
    setSelectedIndex(index);
    onChange?.(index);
  };

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={handleChange} className={className}>
      <Tab.List className="mts-flex mts-border-b mts-border-secondary-200">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            disabled={tab.disabled || false}
            className={({ selected }) =>
              `mts-px-4 mts-py-3 mts-text-sm mts-font-medium mts-border-b-2 mts-transition-colors mts-whitespace-nowrap ${
                selected
                  ? 'mts-border-primary-500 mts-text-primary-600'
                  : 'mts-border-transparent mts-text-secondary-600 hover:mts-text-secondary-900'
              } ${
                tab.disabled
                  ? 'mts-opacity-50 mts-cursor-not-allowed hover:mts-text-secondary-600'
                  : ''
              }`
            }
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels className="mts-mt-4">
        {tabs.map((tab, index) => (
          <Tab.Panel key={index} className="mts-outline-none">
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};
