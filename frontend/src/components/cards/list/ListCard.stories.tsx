import type { Meta, StoryObj } from "@storybook/react-vite";
import ListCard from "./ListCard";

const meta: Meta<typeof ListCard> = {
  title: "Components/Cards/List/ListCard",
  component: ListCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ListCard>;

export const Default: Story = {};

