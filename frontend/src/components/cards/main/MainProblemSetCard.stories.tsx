import type { Meta, StoryObj } from "@storybook/react-vite";
import MainProblemSetCard from "./MainProblemSetCard";

const meta: Meta<typeof MainProblemSetCard> = {
  title: "Components/Cards/Main/MainProblemSetCard",
  component: MainProblemSetCard,
  tags: ["autodocs"],
  args: {
    img: "https://placehold.co/300x200",
  },
  argTypes: {
    img: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof MainProblemSetCard>;

export const Default: Story = {};

