import Button from "../../button/Button";
import TextLink from "../../textLink/TextLink";

interface GroupProps {
  id: number;
  title: string;
  description: string;
  memberCount: number;
  problemCount: number;
  createdAt: string;
}

const Group = ({title, description, memberCount, problemCount, createdAt} : GroupProps) => {
  return (
    <div className="flex justify-between w-full px-6 py-4 border-2 border-grayscale-warm-gray rounded-lg">
      <div className="flex flex-col gap-y-2">
        <div className="text-title">{title}</div>
        <div className="line-clamp-2">{description}</div>
        <div className="flex gap-2">
          <TextLink src="#">
            <img src="/icons/groupIcon.svg" className="size-4" />
            멤버 {memberCount}명
          </TextLink>
          <TextLink src="#">
            <img src="/icons/bookIcon.svg" className="size-4" />
            문제 {problemCount}개
          </TextLink>
          <TextLink src="#">
            <img src="/icons/clockIcon.svg" className="size-4" />
            {createdAt}
          </TextLink>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Button variant="secondary">
          <img src="/icons/addMemberIcon.svg" />
          버튼
        </Button>
      </div>
    </div>
  );
};

export default Group;
