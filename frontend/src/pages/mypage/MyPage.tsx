import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';
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
        <div className="grid max-w-[1600px] grid-cols-[280px_1fr] items-start gap-10 pl-[72px] pr-4 py-8 bg-white w-full">
            <Sidebar />
            <ContentArea />
        </div>
    );
};

export default MyPage;
