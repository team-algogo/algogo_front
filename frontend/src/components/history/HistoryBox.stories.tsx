import type { Meta, StoryObj } from "@storybook/react-vite";
import HistoryBox from "./HistoryBox";

const meta: Meta<typeof HistoryBox> = {
  title: "Components/History/HistoryBox",
  component: HistoryBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HistoryBox>;

export const Default: Story = {};

