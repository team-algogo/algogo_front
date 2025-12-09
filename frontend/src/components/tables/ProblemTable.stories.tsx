import type { Meta, StoryObj } from "@storybook/react-vite";
import ProblemTable from "./ProblemTable";

const meta: Meta<typeof ProblemTable> = {
  title: "Components/Tables/ProblemTable",
  component: ProblemTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProblemTable>;

export const Default: Story = {};

