import Badge from "../../badge/Badge";
import TextLink from "../../textLink/TextLink";

const ListCard = () => {
  return (
    <div className="flex flex-col w-full px-6 py-4 gap-y-2 border-2 border-grayscale-warm-gray rounded-lg">
      <div className="text-title">Title</div>
      <div>contnet</div>
      <div className="flex gap-3">
        <Badge variant="white">badge</Badge>
        <TextLink src="#">
          <img src="/icons/bookIcon.svg" className="size-4" />
          Label
        </TextLink>
      </div>
    </div>
  );
};

export default ListCard;
