import type { Meta, StoryObj } from "@storybook/react-vite";
import MainGroupCard from "./MainGroupCard";

const meta: Meta<typeof MainGroupCard> = {
  title: "Components/Cards/Main/MainGroupCard",
  component: MainGroupCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MainGroupCard>;

export const Default: Story = {};

