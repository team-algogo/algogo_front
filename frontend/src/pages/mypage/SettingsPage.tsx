import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import BasePage from '../BasePage';
import { getUserProfile } from '@api/user/userApi';
import { postCheckNickname } from '@api/auth/auth';
import { updateUserInfo, updateProfileImage, updatePassword } from '@api/user/settingsApi';


import useAuthStore from "@store/useAuthStore";


const SettingsPage = () => {
    const navigate = useNavigate();
    const authorization = useAuthStore((state) => state.authorization); // Check auth

    useEffect(() => {
        if (!authorization) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login", { replace: true });
        }
    }, [authorization, navigate]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Early return if not authorized (to prevent flash of content or queries)
    if (!authorization) return null;


    // Profile State
    const [nickname, setNickname] = useState('');
    const [description, setDescription] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isNicknameChecked, setIsNicknameChecked] = useState(true); // Initially true if unchanged
    const [nicknameError, setNicknameError] = useState('');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Initial Data
    const { data: userProfile, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await getUserProfile();
            return response.data;
        },
    });

    useEffect(() => {
        if (userProfile) {
            setNickname(userProfile.nickname);
            setDescription(userProfile.description || '');
            setProfileImage(userProfile.profileImage);
        }
    }, [userProfile]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNicknameCheck = async () => {
        if (!nickname) return;
        if (nickname === userProfile?.nickname) {
            setIsNicknameChecked(true);
            setNicknameError('');
            alert('현재 사용 중인 닉네임입니다.');
            return;
        }

        try {
            const isAvailable = await postCheckNickname(nickname);
            if (isAvailable) {
                setIsNicknameChecked(true);
                setNicknameError('');
                alert('사용 가능한 닉네임입니다.');
            } else {
                setIsNicknameChecked(false);
                setNicknameError('이미 존재하는 닉네임입니다.');
            }
        } catch (error) {
            console.error(error);
            setNicknameError('중복 확인 중 오류가 발생했습니다.');
        }
    };

    const handleUpdate = async () => {
        // 1. Validation
        if (!isNicknameChecked) {
            alert('닉네임 중복 확인을 해주세요.');
            return;
        }

        const isPasswordChangeRequested = newPassword.length > 0;

        if (isPasswordChangeRequested) {
            if (newPassword !== confirmPassword) {
                setPasswordError('비밀번호가 일치하지 않습니다.');
                return;
            }
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
            if (!passwordRegex.test(newPassword)) {
                setPasswordError('비밀번호는 영문, 숫자, 특수문자를 포함하여 8~20자여야 합니다.');
                return;
            }
        }

        // 2. Diff Checking
        const isNicknameOrDescChanged =
            nickname !== userProfile?.nickname ||
            description !== (userProfile?.description || '');
        const isImageChanged = selectedFile !== null;

        if (!isNicknameOrDescChanged && !isImageChanged && !isPasswordChangeRequested) {
            alert("변경 사항이 없습니다.");
            return;
        }

        setIsSubmitting(true);
        try {
            const promises = [];
            const messages: string[] = [];

            // 3. Queue API Calls
            if (isNicknameOrDescChanged) {
                promises.push(
                    updateUserInfo({ nickname, description })
                        .then(() => messages.push("프로필 정보"))
                );
            }

            if (isImageChanged && selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                promises.push(
                    updateProfileImage(formData)
                        .then(() => messages.push("프로필 이미지"))
                );
            }

            if (isPasswordChangeRequested) {
                promises.push(
                    updatePassword({
                        currentPassword,
                        newPassword
                    }).then(() => messages.push("비밀번호"))
                );
            }

            // 4. Execute All
            await Promise.all(promises);

            // 5. Success Handling
            alert(`${messages.join(', ')} 수정이 완료되었습니다.`);
            navigate('/mypage');

            // Data Reset
            if (isPasswordChangeRequested) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordError('');
            }
            if (isImageChanged) setSelectedFile(null); // Clear file selection

            // Note: If using React Query, you might want to refetch userProfile here or invalidate queries.
            // queryClient.invalidateQueries(['userProfile']);

        } catch (error) {
            console.error('Update failed', error);
            // Ideally parse error message from response
            alert('수정 중 오류가 발생했습니다. 내용을 확인해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };



    if (isLoading) return <div className="flex justify-center py-20">Loading...</div>;

    return (
        <BasePage>
            <div className="flex max-w-[600px] flex-col items-center gap-10 self-stretch mx-auto px-4 py-8">
                {/* Header Link */}
                <div className="self-stretch">
                    <button
                        onClick={() => navigate('/mypage')}
                        className="text-[#0D6EFD] text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="rotate-180">
                            <path d="M1 9L5 5L1 1" stroke="#0D6EFD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        마이페이지로
                    </button>
                </div>

                <div className="flex flex-col items-start gap-8 self-stretch p-8 bg-white rounded-2xl border border-[#EBEDF1] shadow-sm">
                    {/* Profile Section */}
                    <div className="flex flex-col gap-6 self-stretch">
                        <h2 className="text-xl font-bold text-[#050505]">프로필 수정</h2>

                        {/* Image */}
                        <div className="flex justify-center">
                            <div className="relative cursor-pointer group" onClick={handleImageClick}>
                                <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-[#EBEDF1] bg-[#F0F2F5]">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-[#ADB5BD]">
                                            {nickname?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#0D6EFD] rounded-full flex items-center justify-center text-white shadow-md group-hover:bg-[#0B5ED7] transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {/* Nickname */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#333]">닉네임</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => {
                                        setNickname(e.target.value);
                                        setIsNicknameChecked(e.target.value === userProfile?.nickname);
                                        setNicknameError('');
                                    }}
                                    className="flex-1 px-4 py-3 rounded-lg border border-[#EBEDF1] focus:outline-none focus:border-[#0D6EFD]"
                                    placeholder="닉네임을 입력하세요"
                                />
                                <button
                                    onClick={handleNicknameCheck}
                                    className="px-4 py-3 bg-white border border-[#EBEDF1] rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    중복 체크
                                </button>
                            </div>
                            {nicknameError && <p className="text-xs text-red-500">{nicknameError}</p>}
                        </div>

                        {/* Status Message */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#333]">상태 메시지</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="px-4 py-3 rounded-lg border border-[#EBEDF1] focus:outline-none focus:border-[#0D6EFD]"
                                placeholder="오늘도 코딩이랑🐈"
                            />
                        </div>
                    </div>

                    <div className="h-[1px] bg-[#EBEDF1] self-stretch"></div>

                    {/* Account Section */}
                    <div className="flex flex-col gap-6 self-stretch">
                        <h2 className="text-xl font-bold text-[#050505]">회원정보 수정</h2>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#333]">아이디(이메일)</label>
                            <input
                                type="text"
                                value={userProfile?.email || ''}
                                disabled
                                className="px-4 py-3 rounded-lg border border-[#EBEDF1] bg-[#F8F9FA] text-[#777A80]"
                            />
                        </div>

                        {/* Password Change */}
                        <div className="flex flex-col gap-4">
                            <label className="text-sm font-medium text-[#333]">비밀번호 변경</label>
                            <p className="text-xs text-[#777A80] -mt-2">비밀번호를 변경하지 않으려면 아래 필드를 비워두세요.</p>

                            <div className="flex flex-col gap-2">
                                <input
                                    type="password"
                                    placeholder="현재 비밀번호"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="px-4 py-3 rounded-lg border border-[#EBEDF1] focus:outline-none focus:border-[#0D6EFD]"
                                />
                                <input
                                    type="password"
                                    placeholder="새 비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="px-4 py-3 rounded-lg border border-[#EBEDF1] focus:outline-none focus:border-[#0D6EFD]"
                                />
                                <input
                                    type="password"
                                    placeholder="새 비밀번호 확인"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="px-4 py-3 rounded-lg border border-[#EBEDF1] focus:outline-none focus:border-[#0D6EFD]"
                                />
                            </div>
                            {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                        </div>
                    </div>



                    <div className="h-[1px] bg-[#EBEDF1] self-stretch"></div>

                    {/* Footer Actions */}
                    <div className="flex flex-col gap-4 self-stretch">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#333]">가입일</label>
                            <div className="px-4 py-3 rounded-lg border border-[#EBEDF1] bg-[#F8F9FA] text-[#777A80] text-sm">
                                {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleString() : '-'}
                            </div>
                        </div>

                        <div className="flex justify-end items-center mt-4">

                            <button
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                className={`px-6 py-3 text-white rounded-lg font-semibold transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0D6EFD] hover:bg-[#0B5ED7]'}`}
                            >
                                {isSubmitting ? '수정 중...' : '수정하기'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </BasePage>
    );
};

export default SettingsPage;
