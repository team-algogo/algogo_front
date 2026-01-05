import type { Meta, StoryObj } from '@storybook/react-vite';
import ActivityHistory from './ActivityHistory';

const meta: Meta<typeof ActivityHistory> = {
    title: 'Components/MyPage/ActivityHistory',
    component: ActivityHistory,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof ActivityHistory>;

export const Default: Story = {};
