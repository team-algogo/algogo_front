import type { Meta, StoryObj } from "@storybook/react-vite";
import HistoryItem from "./HistoryItem";

const meta: Meta<typeof HistoryItem> = {
  title: "Components/History/HistoryItem",
  component: HistoryItem,
  tags: ["autodocs"],
  args: {
    submissionId: 1,
    isSuccess: true,
    createdAt: "2025-10-24T00:00:00Z",
    language: "Java",
    execTime: 100,
    memory: 1024,
    isCurrent: false,
  },
  argTypes: {
    isSuccess: { control: "boolean" },
    createdAt: { control: "text" },
    language: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof HistoryItem>;

export const Default: Story = {};

export const Failed: Story = {
  args: { 
    submissionId: 2,
    isSuccess: false,
    createdAt: "2025-10-24T00:00:00Z",
    language: "Java",
    execTime: 100,
    memory: 1024,
    isCurrent: false,
  },
};

