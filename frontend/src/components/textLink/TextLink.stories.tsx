import type { Meta, StoryObj } from "@storybook/react-vite";
import TextLink from "./TextLink";

const meta: Meta<typeof TextLink> = {
  title: "Components/TextLink/TextLink",
  component: TextLink,
  tags: ["autodocs"],
  args: {
    variant: "default",
    src: "#",
    children: "텍스트 링크",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary"],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof TextLink>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

