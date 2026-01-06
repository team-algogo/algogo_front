import type { Meta, StoryObj } from '@storybook/react-vite';
import ParticipationStatus from './ParticipationStatus';

const meta: Meta<typeof ParticipationStatus> = {
    title: 'Components/MyPage/ParticipationStatus',
    component: ParticipationStatus,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof ParticipationStatus>;

export const Default: Story = {};
