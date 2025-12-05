import type { Meta, StoryObj } from "@storybook/react-vite";
import GroupCard from "./GroupCard";

const meta: Meta<typeof GroupCard> = {
  title: "Components/Cards/Group/GroupCard",
  component: GroupCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GroupCard>;

export const Default: Story = {};

