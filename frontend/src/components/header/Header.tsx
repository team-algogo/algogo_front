import { postLogout } from "@api/auth/auth";
import TextLink from "@components/textLink/TextLink";
import useAuthStore from "@store/useAuthStore";

const Header = () => {
  const { userType, setUserType, setAuthorization } = useAuthStore();

  const logout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const response = await postLogout();
      if (response.status == 200) {
        setUserType(null);
        setAuthorization("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full flex justify-between px-6">
      <div className="flex gap-2 items-center">
        <a href="/" className="font-logo text-xl px-6.5 py-6">
          알고가자
        </a>
        <TextLink src="/problemset" className="px-3.5 py-3">
          문제집
        </TextLink>
        <TextLink src="#" className="px-3.5 py-3">
          캠페인
        </TextLink>
        <TextLink src="#" className="px-3.5 py-3">
          그룹방
        </TextLink>
        <a href="#" className="size-10 flex justify-center items-center">
          <img src="/icons/searchIconBlack.svg" />
        </a>
      </div>
      <div className="flex gap-2 items-center">
        {userType == "User" ? (
          <>
            <TextLink src="/" className="px-3.5 py-3">
              마이페이지
            </TextLink>
            <TextLink src="/" className="px-3.5 py-3" onClick={logout}>
              로그아웃
            </TextLink>
          </>
        ) : (
          <TextLink src="/login" variant="secondary" className="px-3.5 py-3">
            로그인
          </TextLink>
        )}
      </div>
    </div>
  );
};

export default Header;
