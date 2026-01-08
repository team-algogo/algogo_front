import client from "@api/client";

export interface PasswordUpdateRequest {
    currentPassword?: string;
    newPassword?: string;
}

// 프로필 수정 (이미지, 닉네임, 상태메시지)
// FormData를 사용하므로 Content-Type은 axios가 자동으로 설정하게 둠
export const updateProfile = async (formData: FormData) => {
    const response = await client.patch("/api/v1/users/profiles", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// 비밀번호 수정
export const updatePassword = async (data: PasswordUpdateRequest) => {
    const response = await client.patch("/api/v1/users/password", data);
    return response.data;
};

// 회원 탈퇴
export const withdrawUser = async () => {
    const response = await client.delete("/api/v1/users");
    return response.data;
};
