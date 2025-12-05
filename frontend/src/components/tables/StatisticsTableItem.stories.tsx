import type { Meta, StoryObj } from "@storybook/react-vite";
import StatisticsTableItem from "./StatisticsTableItem";

const meta: Meta<typeof StatisticsTableItem> = {
  title: "Components/Tables/StatisticsTableItem",
  component: StatisticsTableItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatisticsTableItem>;

export const Default: Story = {};

