import type { Meta, StoryObj } from "@storybook/react-vite";
import RadioButton from "./RadioButton";

const meta: Meta<typeof RadioButton> = {
  title: "Components/Button/RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
  args: {
    text: "선택",
    disabled: false,
  },
  argTypes: {
    text: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

