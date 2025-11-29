const MemberCard = () => {
  return (
    <div className="flex items-center w-[218px] px-3 py-3 gap-[11px] border-2 border-grayscale-warm-gray rounded-lg">
      <div className="flex justify-center items-center rounded-full size-10 bg-primary-main text-title text-white">
        김
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="text-title">Label</div>
        <div className="text-grayscale-warm-gray">Label</div>
      </div>
    </div>
  );
};

export default MemberCard;
