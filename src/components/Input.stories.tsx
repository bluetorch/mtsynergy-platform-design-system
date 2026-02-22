import type { Meta, StoryObj } from '@storybook/react';
import { Input, Textarea, Select } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helpText: {
      control: 'text',
      description: 'Helper text below input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    type: {
      control: 'text',
      description: 'Input type (text, email, password, etc.)',
    },
  },
};

export default meta;

type InputStory = StoryObj<typeof Input>;
export const Default: InputStory = {
  args: {
    placeholder: 'Enter text',
  },
};

export const WithLabel: InputStory = {
  args: {
    label: 'Email Address',
    placeholder: 'your@example.com',
    type: 'email',
  },
};

export const WithHelpText: InputStory = {
  args: {
    label: 'Email',
    placeholder: 'your@example.com',
    helpText: "We'll never share your email",
    type: 'email',
  },
};

export const WithError: InputStory = {
  args: {
    label: 'Email',
    placeholder: 'your@example.com',
    error: 'Invalid email format',
    type: 'email',
  },
};

export const Disabled: InputStory = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    value: 'Disabled value',
  },
};

export const Password: InputStory = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

type TextareaStory = StoryObj<typeof Textarea>;
export const TextareaDefault: TextareaStory = {
  render: (args) => <Textarea {...args} />,
  args: {
    placeholder: 'Enter your message',
  },
};

export const TextareaWithLabel: TextareaStory = {
  render: (args) => <Textarea {...args} />,
  args: {
    label: 'Comments',
    placeholder: 'Enter your comments here',
  },
};

export const TextareaWithError: TextareaStory = {
  render: (args) => <Textarea {...args} />,
  args: {
    label: 'Message',
    error: 'Message is too long (max 500 characters)',
    placeholder: 'Enter your message',
  },
};

type SelectStory = StoryObj<typeof Select>;
export const SelectDefault: SelectStory = {
  render: (args) => (
    <Select {...args}>
      <option value="">Select an option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </Select>
  ),
};

export const SelectWithLabel: SelectStory = {
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="ca">Canada</option>
    </Select>
  ),
  args: {
    label: 'Country',
  },
};

export const SelectWithError: SelectStory = {
  render: (args) => (
    <Select {...args}>
      <option value="">Select an option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
  ),
  args: {
    label: 'Required Field',
    error: 'This field is required',
  },
};

export const AllInputTypes: InputStory = {
  render: () => (
    <div className="mts-flex mts-flex-col mts-gap-6">
      <Input label="Text Input" placeholder="Enter text" />
      <Input label="Email" type="email" placeholder="your@example.com" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Number" type="number" placeholder="Enter number" />
      <Input label="Error State" error="This field is required" placeholder="Enter value" />
      <Input label="Help Text" helpText="Additional information" placeholder="Enter text" />
      <Input label="Disabled" disabled value="Disabled" />
    </div>
  ),
};
