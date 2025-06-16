import { ReactNode, ChangeEventHandler } from "react";
export const Checkbox = ({
  children,
  onChange,
  checked,
  disabled,
  "data-testid": dataTestId,
}: {
  children: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  disabled?: boolean;
  "data-testid"?: string;
}) => {
  return (
    <label className="flex flex-row gap-1 items-center cursor-pointer">
      <input
        className="accent-teal-600 dark:accent-teal-300"
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        data-testid={dataTestId}
      />
      {children}
    </label>
  );
};
