import { ReactNode, ChangeEventHandler } from "react";
export const Checkbox = ({
  children,
  onChange,
  checked,
  disabled,
}: {
  children: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  disabled?: boolean;
}) => {
  return (
    <label className="flex flex-row gap-1 items-center cursor-pointer">
      <input
        className="accent-teal-600 dark:accent-teal-300"
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      {children}
    </label>
  );
};
