import { useState } from "react";
import TextLink from "../textLink/TextLink";

const Header = () => {
  const [user, setUser] = useState(true);
  return (
    <div className="w-full flex justify-between px-6">
      <div className="flex gap-2 items-center">
        <a href="/" className="font-logo px-6.5 py-6">
          알고가자
        </a>
        <TextLink src="#" className="px-3.5 py-3">
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
        {user ? (
          <>
            <a href="#" className="size-10 flex justify-center items-center">
              <img src="/icons/alarmIcon.svg" />
            </a>
            <div className="flex gap-2 px-3.5 py-3">
              <img src="/icons/userIcon.svg" />
              <div>000 님</div>
            </div>
            <TextLink
              src="#"
              className="px-3.5 py-3"
              onClick={() => setUser(false)}
            >
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
