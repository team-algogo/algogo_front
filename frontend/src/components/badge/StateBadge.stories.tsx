import type { Meta, StoryObj } from "@storybook/react-vite";
import StateBadge from "./StateBadge";

const meta: Meta<typeof StateBadge> = {
  title: "Components/Badge/StateBadge",
  component: StateBadge,
  tags: ["autodocs"],
  args: {
    isPassed: true,
    hasText: true,
  },
  argTypes: {
    isPassed: { control: "boolean" },
    hasText: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof StateBadge>;

export const PassedWithText: Story = {};

export const FailedWithText: Story = {
  args: { isPassed: false },
};

export const PassedDot: Story = {
  args: { hasText: false },
};

export const FailedDot: Story = {
  args: { isPassed: false, hasText: false },
};

