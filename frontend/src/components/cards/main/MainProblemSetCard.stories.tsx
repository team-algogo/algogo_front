import type { Meta, StoryObj } from "@storybook/react-vite";
import MainProblemSetCard from "./MainProblemSetCard";

const meta: Meta<typeof MainProblemSetCard> = {
  title: "Components/Cards/Main/MainProblemSetCard",
  component: MainProblemSetCard,
  tags: ["autodocs"],
  args: {
    data: {
      programId: 1,
      title: "알고리즘 기초 100제",
      description: "코딩테스트 입문을 위한 필수 알고리즘 문제들을 모았습니다.",
      thumbnail: "https://placehold.co/300x200",
      createAt: "2024-01-01",
      modifiedAt: "2024-01-01",
      programType: "PROBLEM_SET",
      categories: ["자료구조", "완전탐색", "DP"],
      totalParticipants: 1542,
      problemCount: 100,
    },
    badges: [{ text: "New", variant: "orange" }],
  },
};

export default meta;
type Story = StoryObj<typeof MainProblemSetCard>;

export const Default: Story = {};
