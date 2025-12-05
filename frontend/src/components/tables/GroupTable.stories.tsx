import type { Meta, StoryObj } from "@storybook/react-vite";
import GroupTable from "./GroupTable";

const meta: Meta<typeof GroupTable> = {
  title: "Components/Tables/GroupTable",
  component: GroupTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GroupTable>;

export const Default: Story = {};

