interface ContentBoxProps {
  formId?: string;
  maxLength?: number;
  value?: string;
  onSubmit?: () => void;
  onChange?: () => void;
  placeholder?: string;
}

const ContentBox = ({ maxLength = 200 }: ContentBoxProps) => {
  return (
    <form>
      <textarea
        maxLength={maxLength}
        className="px-4 py-5 w-full border-2 border-grayscale-warm-gray bg-[#F9FAFB] text-grayscale-warm-gray rounded-lg resize-none"
      ></textarea>
    </form>
  );
};

export default ContentBox;
