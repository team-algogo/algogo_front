import TextLink from "../textLink/TextLink";

const SearchNav = () => {
  return (
    <div className="flex flex-col w-40">
      <div className="inline-flex justify-center items-center px-6 py-4 bg-primary-main text-white">
        검색 결과
      </div>
      <TextLink
        src="#"
        className="px-3.5 py-3 border border-transparent border-b-primary-main"
      >
        문제
      </TextLink>
      <TextLink
        src="#"
        className="px-3.5 py-3 border border-transparent border-b-primary-main"
      >
        문제집
      </TextLink>
      <TextLink
        src="#"
        className="px-3.5 py-3 border border-transparent border-b-primary-main"
      >
        출처
      </TextLink>
      <TextLink
        src="#"
        className="px-3.5 py-3 border border-transparent border-b-primary-main"
      >
        그룹방
      </TextLink>
      <TextLink
        src="#"
        className="px-3.5 py-3 border border-transparent border-b-primary-main"
      >
        캠페인
      </TextLink>
    </div>
  );
};

export default SearchNav;
