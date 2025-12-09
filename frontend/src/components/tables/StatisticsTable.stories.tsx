import type { Meta, StoryObj } from "@storybook/react-vite";
import StatisticsTable from "./StatisticsTable";

const meta: Meta<typeof StatisticsTable> = {
  title: "Components/Tables/StatisticsTable",
  component: StatisticsTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatisticsTable>;

export const Default: Story = {};

