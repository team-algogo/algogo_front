import Button from "../../button/Button";
import TextLink from "../../textLink/TextLink";

const Group = () => {
  return (
    <div className="flex justify-between w-[663px] px-6 py-4 border-2 border-grayscale-warm-gray rounded-lg">
      <div className="flex flex-col gap-y-2">
        <div className="text-title">Title</div>
        <div>discriptions</div>
        <div className="flex gap-2">
          <TextLink src="#">
            <img src="/icons/groupIcon.svg" className="size-4" />
            Label
          </TextLink>
          <TextLink src="#">
            <img src="/icons/bookIcon.svg" className="size-4" />
            Label
          </TextLink>
          <TextLink src="#">
            <img src="/icons/clockIcon.svg" className="size-4" />
            Label
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
