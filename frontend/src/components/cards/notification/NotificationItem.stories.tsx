import type { Meta, StoryObj } from "@storybook/react-vite";
import NotificationItem from "./NotificationItem";

const meta: Meta<typeof NotificationItem> = {
  title: "Components/Cards/Notification/NotificationItem",
  component: NotificationItem,
  tags: ["autodocs"],
  args: {
    isRead: false,
    title: "새 리뷰가 등록되었습니다",
    tags: ["java", "dp"],
    problemName: "문제 제목",
    createdAt: "방금 전",
  },
  argTypes: {
    isRead: { control: "boolean" },
    title: { control: "text" },
    tags: { control: "object" },
    problemName: { control: "text" },
    createdAt: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

export const Default: Story = {};

export const Read: Story = {
  args: { isRead: true },
};

