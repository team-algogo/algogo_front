interface RadioProps {
  text: string;
  disabled: boolean;
}

const RadioButton = ({ text, disabled }: RadioProps) => {
  return (
    <label>
      <input type="radio" disabled={disabled} />
      <span>{text}</span>
    </label>
  );
};

export default RadioButton;
