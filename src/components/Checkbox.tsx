export const Checkbox = ({
  children,
  onChange,
  checked,
  disabled,
}: {
  children: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  disabled?: boolean;
}) => {
  return (
    <label className="flex flex-row gap-1 items-center">
      <input
        className="accent-teal-600"
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      {children}
    </label>
  );
};
