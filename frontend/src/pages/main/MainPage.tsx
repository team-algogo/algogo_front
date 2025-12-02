import Banner from "../../components/banner/Banner";

import MainGroupCard from "../../components/cards/main/MainGroupCard";
import TextLink from "../../components/textLink/TextLink";

import MainProblemSetCard from "../../components/cards/main/MainProblemSetCard";
import img from "../../assets/images/MainCard/MainCard1.jpg";
import BasePage from "../BasePage";

const MainPage = () => {
  return (
    <BasePage>
      <Banner />
      <div className="flex flex-col gap-6">
        <div className="font-title text-2xl px-6 py-8">
          지금 이런 코드들이 리뷰되고 있어요!
        </div>
        <div className="flex justify-center gap-15">
          <MainGroupCard />
          <MainGroupCard />
          <MainGroupCard />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-6 py-3">
          <div className="font-title text-2xl">추천 문제집</div>
          <TextLink src="#">전체보기 →</TextLink>
        </div>
        <div className="flex gap-12 pl-8">
          <MainProblemSetCard img={img} />
          <MainProblemSetCard img={img} />
          <MainProblemSetCard img={img} />
          <MainProblemSetCard img={img} />
        </div>
      </div>

      <div className="flex justify-between">
        {/* 캠페인 선택 */}
        <div className="w-[650px] flex flex-col gap-2 px-6">
          <div className="flex justify-between">
            <div className="font-title text-2xl p-2">캠페인</div>
            <TextLink src="#">전체보기 →</TextLink>
          </div>
          <div className="flex flex-col px-1">
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
          </div>
        </div>
        {/* 그룹 선택 */}
        <div className="w-[650px] flex flex-col gap-2 px-6">
          <div className="flex justify-between">
            <div className="font-title text-2xl p-2">그룹현황</div>
            <TextLink src="#">전체보기 →</TextLink>
          </div>
          <div className="flex flex-col px-1">
            <a href="#" className="flex justify-between">
              <div className="flex items-center">그룹 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">그룹 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">그룹 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default MainPage;
