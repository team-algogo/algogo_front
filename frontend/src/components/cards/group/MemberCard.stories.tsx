import type { Meta, StoryObj } from "@storybook/react-vite";
import MemberCard from "./MemberCard";

const meta: Meta<typeof MemberCard> = {
  title: "Components/Cards/Group/MemberCard",
  component: MemberCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MemberCard>;

export const Default: Story = {};

