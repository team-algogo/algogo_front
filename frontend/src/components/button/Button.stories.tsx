import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    variant: "primary",
    children: "버튼",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "default", "text"],
    },
    children: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const DefaultVariant: Story = {
  args: { variant: "default" },
};

export const Text: Story = {
  args: { variant: "text" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

