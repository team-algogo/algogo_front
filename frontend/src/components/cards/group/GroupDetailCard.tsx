import Badge from "../../badge/Badge";
import Button from "../../button/Button";
import TextLink from "../../textLink/TextLink";

const GroupDetailCard = () => {
  return (
    <div className="flex flex-col gap-y-3 w-[255px] p-4 border-2 border-primary-main rounded-lg">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="">Group Name</div>
          <Badge>Role</Badge>
        </div>
        <div className="text-grayscale-warm-gray">descriptions</div>
      </div>
      <div className="flex flex-col items-start">
        <TextLink src="#">
          <img src="/icons/groupIcon.svg" />
          Label
        </TextLink>
        <TextLink src="#">
          <img src="/icons/bookIcon.svg" className="size-4" />
          Label
        </TextLink>
      </div>
      {/* Avatar로 변경 예정 */}
      <Button>Button</Button>
    </div>
  );
};

export default GroupDetailCard;
