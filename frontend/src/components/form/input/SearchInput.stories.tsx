import type { Meta, StoryObj } from "@storybook/react-vite";
import SearchInput from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Components/Form/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: {
    formId: "search-input",
    selectedItems: [],
    onItemsChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};

