import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Basic: Story = {
  args: {
    tabs: [
      { label: 'Tab 1', content: 'Content for tab 1' },
      { label: 'Tab 2', content: 'Content for tab 2' },
      { label: 'Tab 3', content: 'Content for tab 3' },
    ],
  },
};

export const WithContent: Story = {
  args: {
    tabs: [
      {
        label: 'Overview',
        content: (
          <div className="mts-space-y-2">
            <h3 className="mts-text-lg mts-font-semibold">Overview</h3>
            <p>This is the overview tab content with detailed information.</p>
          </div>
        ),
      },
      {
        label: 'Details',
        content: (
          <div className="mts-space-y-2">
            <h3 className="mts-text-lg mts-font-semibold">Details</h3>
            <ul className="mts-list-disc mts-list-inside">
              <li>Detail 1</li>
              <li>Detail 2</li>
              <li>Detail 3</li>
            </ul>
          </div>
        ),
      },
      {
        label: 'Settings',
        content: (
          <div className="mts-space-y-2">
            <h3 className="mts-text-lg mts-font-semibold">Settings</h3>
            <p>Configure your preferences here.</p>
          </div>
        ),
      },
    ],
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      { label: 'Enabled', content: 'Content 1' },
      { label: 'Disabled', content: 'Content 2', disabled: true },
      { label: 'Enabled Again', content: 'Content 3' },
    ],
  },
};

export const FiveTabsExample: Story = {
  args: {
    tabs: [
      { label: 'General', content: 'General settings content' },
      { label: 'Security', content: 'Security settings content' },
      { label: 'Privacy', content: 'Privacy settings content' },
      { label: 'Notifications', content: 'Notifications settings content' },
      { label: 'Advanced', content: 'Advanced settings content' },
    ],
  },
};

export const WithDefaultTab: Story = {
  args: {
    defaultIndex: 1,
    tabs: [
      { label: 'Tab 1', content: 'Content 1' },
      { label: 'Tab 2 (Default)', content: 'Content 2 - This is the default tab' },
      { label: 'Tab 3', content: 'Content 3' },
    ],
  },
};

export const RichContent: Story = {
  render: () => {
    return (
      <Tabs
        tabs={[
          {
            label: 'Documentation',
            content: (
              <div>
                <h4 className="mts-text-lg mts-font-semibold mts-mb-4">Getting Started</h4>
                <p className="mts-mb-4">
                  Follow these steps to get started with the component library.
                </p>
                <ol className="mts-list-decimal mts-list-inside mts-space-y-2">
                  <li>Install dependencies</li>
                  <li>Import components</li>
                  <li>Use in your application</li>
                </ol>
              </div>
            ),
          },
          {
            label: 'Examples',
            content: (
              <div>
                <h4 className="mts-text-lg mts-font-semibold mts-mb-4">Code Examples</h4>
                <pre className="mts-bg-secondary-100 mts-p-4 mts-rounded mts-text-sm mts-overflow-auto">
                  {`import { Button } from '@components';\n\n<Button>Click me</Button>`}
                </pre>
              </div>
            ),
          },
          {
            label: 'API',
            content: (
              <div>
                <h4 className="mts-text-lg mts-font-semibold mts-mb-4">Component Props</h4>
                <table className="mts-w-full mts-border mts-border-secondary-200">
                  <thead>
                    <tr className="mts-bg-secondary-100">
                      <th className="mts-px-4 mts-py-2 mts-text-left">Prop</th>
                      <th className="mts-px-4 mts-py-2 mts-text-left">Type</th>
                      <th className="mts-px-4 mts-py-2 mts-text-left">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="mts-px-4 mts-py-2">label</td>
                      <td className="mts-px-4 mts-py-2">string</td>
                      <td className="mts-px-4 mts-py-2">-</td>
                    </tr>
                    <tr>
                      <td className="mts-px-4 mts-py-2">content</td>
                      <td className="mts-px-4 mts-py-2">ReactNode</td>
                      <td className="mts-px-4 mts-py-2">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ),
          },
        ]}
      />
    );
  },
};

export const InteractiveExample: Story = {
  render: () => {
    return (
      <div className="mts-space-y-4">
        <h3 className="mts-text-lg mts-font-semibold">Interactive Tabs</h3>
        <Tabs
          tabs={[
            { label: 'React', content: 'React is a JavaScript library for building UIs.' },
            { label: 'Vue', content: 'Vue is a progressive JavaScript framework.' },
            { label: 'Svelte', content: 'Svelte is a brand new approach to building UIs.' },
          ]}
          onChange={(index) => console.log('Changed to tab:', index)}
        />
      </div>
    );
  },
};
