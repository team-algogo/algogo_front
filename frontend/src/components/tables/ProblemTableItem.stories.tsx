import type { Meta, StoryObj } from "@storybook/react-vite";
import ProblemTableItem from "./ProblemTableItem";

const meta: Meta<typeof ProblemTableItem> = {
  title: "Components/Tables/ProblemTableItem",
  component: ProblemTableItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProblemTableItem>;

export const Default: Story = {};

