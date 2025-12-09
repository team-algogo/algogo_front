import type { Meta, StoryObj } from "@storybook/react-vite";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    variant: "blue",
    children: "Badge",
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
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Gray: Story = { args: { variant: "gray" } };

export const Green: Story = { args: { variant: "green" } };

export const Red: Story = { args: { variant: "red" } };

export const Orange: Story = { args: { variant: "orange" } };

export const DefaultVariant: Story = { args: { variant: "default" } };

export const Black: Story = { args: { variant: "black" } };

export const White: Story = { args: { variant: "white" } };

