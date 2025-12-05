import type { Meta, StoryObj } from "@storybook/react-vite";
import GroupTableItem from "./GroupTableItem";

const meta: Meta<typeof GroupTableItem> = {
  title: "Components/Tables/GroupTableItem",
  component: GroupTableItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GroupTableItem>;

export const Default: Story = {};

