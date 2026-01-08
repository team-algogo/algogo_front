import type { Meta, StoryObj } from '@storybook/react-vite';
import ContentArea from './ContentArea';

const meta: Meta<typeof ContentArea> = {
    title: 'Components/MyPage/ContentArea',
    component: ContentArea,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof ContentArea>;

export const Default: Story = {};
