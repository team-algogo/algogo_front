import type { Meta, StoryObj } from "@storybook/react-vite";
import ContentBox from "./ContentBox";

const meta: Meta<typeof ContentBox> = {
  title: "Components/Form/ContentBox",
  component: ContentBox,
  tags: ["autodocs"],
  args: {
    maxLength: 200,
  },
};

export default meta;
type Story = StoryObj<typeof ContentBox>;

export const Default: Story = {};

export const ShortLimit: Story = {
  args: { maxLength: 50 },
};

