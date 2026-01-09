import type { Meta, StoryObj } from "@storybook/react-vite";
import PasswordInput from "./PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  title: "Components/Form/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  args: {
    id: "password-input",
    value: "",
    placeholder: "비밀번호를 입력하세요",
    status: "default",
    onChange: () => {},
  },
  argTypes: {
    status: {
      control: "select",
      options: ["default", "error", "warning", "success"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {};

export const Error: Story = {
  args: { status: "error" },
};

export const Warning: Story = {
  args: { status: "warning" },
};

export const Success: Story = {
  args: { status: "success" },
};

