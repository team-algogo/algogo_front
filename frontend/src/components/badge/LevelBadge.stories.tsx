import type { Meta, StoryObj } from "@storybook/react-vite";
import LevelBadge from "./LevelBadge";

const meta: Meta<typeof LevelBadge> = {
  title: "Components/Badge/LevelBadge",
  component: LevelBadge,
  tags: ["autodocs"],
  args: {
    titleText: "Title",
    levelText: "Lv.1",
    variant: "blue",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "blue",
        "gray",
        "green",
        "red",
        "orange",
        "default",
        "black",
        "white",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LevelBadge>;

// 기본 스토리
export const Default: Story = {};

// Variants
export const Blue: Story = {
  args: { variant: "blue", titleText: "Attack", levelText: "Lv.1" },
};

export const Gray: Story = {
  args: { variant: "gray", titleText: "Defense", levelText: "Lv.2" },
};

export const Green: Story = {
  args: { variant: "green", titleText: "Speed", levelText: "Lv.3" },
};

export const Red: Story = {
  args: { variant: "red", titleText: "Health", levelText: "Lv.4" },
};

export const Orange: Story = {
  args: { variant: "orange", titleText: "Magic", levelText: "Lv.5" },
};

export const DefaultVariant: Story = {
  args: { variant: "default", titleText: "Default", levelText: "Lv.6" },
};

export const Black: Story = {
  args: { variant: "black", titleText: "Shadow", levelText: "Lv.7" },
};

export const White: Story = {
  args: { variant: "white", titleText: "Light", levelText: "Lv.8" },
};
