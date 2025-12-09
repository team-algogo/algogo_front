import Badge from "../../badge/Badge";
import Button from "../../button/Button";
import TextLink from "../../textLink/TextLink";

const GroupDayCard = () => {
  return (
    <div className="flex flex-col gap-y-3 w-[255px] px-4 py-3 border-2 border-primary-main rounded-lg">
      <div className="flex justify-between">
        <Badge>State</Badge>
        <Badge variant="white">Day</Badge>
      </div>
      <div className="text-title">Group Name</div>
      <div className="text-grayscale-warm-gray">descriptions</div>
      <div className="flex gap-2">
        <TextLink src="#">
          <img src="/icons/groupIcon.svg" className="size-4" />
          Label
        </TextLink>
        <TextLink src="#">
          <img src="/icons/bookIcon.svg" className="size-4" />
          Label
        </TextLink>
      </div>
      <Button>Button</Button>
    </div>
  );
};

export default GroupDayCard;
