import Button from "../../components/button/Button";
import IdInput from "../../components/form/input/IdInput";
import PasswordInput from "../../components/form/input/PasswordInput";
import TextLink from "../../components/textLink/TextLink";
import BasePage from "../BasePage";

const LoginPage = () => {
  return (
    <BasePage>
      <div className="w-full min-h-[calc(100vh-150px)] flex justify-center items-center py-6">
        <form
          action="POST"
          className="flex flex-col gap-[34px] w-[500px] px-8 py-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] rounded-lg"
        >
          <div className="flex justify-center font-title text-2xl ">로그인</div>
          <div className="flex flex-col gap-10">
            <div>
              <label htmlFor="">아이디</label>
              <IdInput formId={""} />
            </div>
            <div>
              <label htmlFor="">비밀번호</label>
              <PasswordInput formId={""} />
            </div>
          </div>
          <div className="flex justify-center gap-12">
            <a href="#">
              <img src="/icons/login/GoogleIcon.svg" />
            </a>
            <a href="#">
              <img src="/icons/login/NaverIcon.svg" />
            </a>
            <a href="#">
              <img src="/icons/login/KakaoIcon.svg" />
            </a>
          </div>
          <div>
            <div className="py-2">
              <Button>로그인</Button>
            </div>
            <div className="flex justify-center gap-2">
              <TextLink src="#">아이디 찾기</TextLink>
              <div>/</div>
              <TextLink src="#">비밀번호 찾기</TextLink>
            </div>
            <TextLink src="#" variant="secondary">
              회원가입하기
            </TextLink>
          </div>
        </form>
      </div>
    </BasePage>
  );
};

export default LoginPage;
