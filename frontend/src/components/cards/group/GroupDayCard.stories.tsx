import type { Meta, StoryObj } from "@storybook/react-vite";
import GroupDayCard from "./GroupDayCard";

const meta: Meta<typeof GroupDayCard> = {
  title: "Components/Cards/Group/GroupDayCard",
  component: GroupDayCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GroupDayCard>;

export const Default: Story = {};

