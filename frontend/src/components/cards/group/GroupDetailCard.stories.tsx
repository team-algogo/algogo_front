import type { Meta, StoryObj } from "@storybook/react-vite";
import GroupDetailCard from "./GroupDetailCard";

const meta: Meta<typeof GroupDetailCard> = {
  title: "Components/Cards/Group/GroupDetailCard",
  component: GroupDetailCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GroupDetailCard>;

export const Default: Story = {};

