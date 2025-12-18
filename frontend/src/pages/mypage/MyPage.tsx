import BasePage from '../BasePage';
import Sidebar from '@components/mypage/Sidebar';
import ContentArea from '@components/mypage/ContentArea';

const MyPage = () => {
    return (
        <BasePage>
            <div className="flex max-w-[1440px] items-start gap-3 self-stretch mx-auto px-4 py-8">
                <Sidebar />
                <ContentArea />
            </div>
        </BasePage>
    );
};

export default MyPage;
