import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';
import BasePage from '../BasePage';
import Sidebar from '@components/mypage/Sidebar';
import ContentArea from '@components/mypage/ContentArea';

const MyPage = () => {
    const navigate = useNavigate();
    const authorization = useAuthStore((state) => state.authorization);

    useEffect(() => {
        if (!authorization) {
            alert("로그인이 필요한 서비스입니다.");
            navigate('/login', { replace: true });
        }
    }, [authorization, navigate]);

    if (!authorization) return null;

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
