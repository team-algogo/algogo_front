import type { Meta, StoryObj } from "@storybook/react-vite";
import SearchNav from "./SearchNav";

const meta: Meta<typeof SearchNav> = {
  title: "Components/Nav/SearchNav",
  component: SearchNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchNav>;

export const Default: Story = {};

