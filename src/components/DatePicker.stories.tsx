import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    showTimeSelect: {
      control: 'boolean',
      description: 'Whether to show time selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

const BasicComponent = (): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  return <DatePicker selected={date} onChange={setDate} />;
};

export const Basic: Story = {
  render: () => <BasicComponent />,
};

const WithLabelComponent = (): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  return <DatePicker selected={date} onChange={setDate} label="Birth Date" />;
};

export const WithLabel: Story = {
  render: () => <WithLabelComponent />,
};

const WithHelpTextComponent = (): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      label="Event Date"
      helpText="Select the date when the event will occur"
    />
  );
};

export const WithHelpText: Story = {
  render: () => <WithHelpTextComponent />,
};

const WithErrorComponent = (): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      label="Required Date"
      error="Please select a date"
    />
  );
};

export const WithError: Story = {
  render: () => <WithErrorComponent />,
};

const WithTimeSelectComponent = (): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      label="Meeting Time"
      showTimeSelect
      placeholderText="Select date and time"
    />
  );
};

export const WithTimeSelect: Story = {
  render: () => <WithTimeSelectComponent />,
};

const WithConstraintsComponent = (): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      label="Booking Date"
      minDate={minDate}
      maxDate={maxDate}
      helpText="Select a date within the next 30 days"
    />
  );
};

export const WithConstraints: Story = {
  render: () => <WithConstraintsComponent />,
};

const DisabledComponent = (): JSX.Element => {
  const [date] = useState<Date | null>(new Date());
  return <DatePicker selected={date} onChange={() => {}} label="Disabled DatePicker" disabled />;
};

export const Disabled: Story = {
  render: () => <DisabledComponent />,
};

const CustomFormatComponent = (): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      label="Date (DD/MM/YYYY)"
      dateFormat="dd/MM/yyyy"
    />
  );
};

export const CustomFormat: Story = {
  render: () => <CustomFormatComponent />,
};

const AllFeaturesComponent = (): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 7);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      label="Special Event Date"
      helpText="Select a date within the allowed range"
      minDate={minDate}
      maxDate={maxDate}
      showTimeSelect
      dateFormat="MMM d, yyyy h:mm aa"
    />
  );
};

export const AllFeatures: Story = {
  render: () => <AllFeaturesComponent />,
};

const MultipleInstancesComponent = (): JSX.Element => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="mts-space-y-4">
      <DatePicker
        selected={startDate}
        onChange={setStartDate}
        label="Start Date"
        minDate={new Date()}
      />
      <DatePicker
        selected={endDate}
        onChange={setEndDate}
        label="End Date"
        minDate={startDate || new Date()}
      />
    </div>
  );
};

export const MultipleInstances: Story = {
  render: () => <MultipleInstancesComponent />,
};
