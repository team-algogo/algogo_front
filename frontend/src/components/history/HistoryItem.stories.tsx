import type { Meta, StoryObj } from "@storybook/react-vite";
import HistoryItem from "./HistoryItem";

const meta: Meta<typeof HistoryItem> = {
  title: "Components/History/HistoryItem",
  component: HistoryItem,
  tags: ["autodocs"],
  args: {
    isPassed: true,
    createdAt: "2025.10.24",
    language: "Java",
  },
  argTypes: {
    isPassed: { control: "boolean" },
    createdAt: { control: "text" },
    language: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof HistoryItem>;

export const Default: Story = {};

export const Failed: Story = {
  args: { isPassed: false },
};

