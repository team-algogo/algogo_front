import type { Meta, StoryObj } from "@storybook/react-vite";
import GroupListCard from "./GroupListCard";

const meta: Meta<typeof GroupListCard> = {
  title: "Components/Cards/Group/GroupListCard",
  component: GroupListCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GroupListCard>;

export const Default: Story = {};

