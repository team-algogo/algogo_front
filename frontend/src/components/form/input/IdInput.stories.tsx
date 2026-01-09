import type { Meta, StoryObj } from "@storybook/react-vite";
import IdInput from "./IdInput";

const meta: Meta<typeof IdInput> = {
  title: "Components/Form/IdInput",
  component: IdInput,
  tags: ["autodocs"],
  args: {
    id: "id-input",
    value: "",
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof IdInput>;

export const Default: Story = {};

