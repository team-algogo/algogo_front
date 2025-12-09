import Badge from "../../badge/Badge";
import Button from "../../button/Button";
import TextLink from "../../textLink/TextLink";

const GroupCard = () => {
  return (
    <div className="flex flex-col gap-y-3 w-[270px] p-6 border-2 border-primary-main rounded-lg">
      <div className="flex justify-between">
        <Badge variant="white">State</Badge>
        <Badge variant="black">Level</Badge>
      </div>
      <div className="text-title">Problem Name</div>
      <div className="flex">
        <TextLink src="#">
          <img src="/icons/groupIcon.svg" />
          Label
        </TextLink>
      </div>
      <Button>Button</Button>
    </div>
  );
};

export default GroupCard;
