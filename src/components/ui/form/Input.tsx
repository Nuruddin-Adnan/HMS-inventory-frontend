import cn from "@/lib/cn";

export default function Input({
  ref,
  id,
  type = "text",
  name,
  step,
  min,
  max,
  list,
  placeholder,
  label,
  inline,
  inlineClassName,
  defaultValue,
  value,
  autocomplete,
  className,
  onChange,
  onFocus,
  labelClassName,
  disabled = false,
  required = false,
  autoFocus = false,
}: {
  ref?: any;
  id?: string;
  type?: string;
  name?: string;
  step?: string;
  min?: string | number;
  max?: string | number;
  list?: string;
  placeholder?: string;
  label?: React.ReactNode | string;
  inline?: boolean;
  inlineClassName?: string;
  defaultValue?: any;
  value?: any;
  autocomplete?: string;
  className?: string;
  onChange?: any;
  onFocus?: any;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div
      className={
        cn(inline
          ? "sm:flex items-center whitespace-nowrap gap-4"
          : "",
          inlineClassName)
      }
    >
      {label && (
        <label
          className={cn(
            "block text-sm font-semibold text-textPrimary mb-1",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        defaultValue={defaultValue}
        value={value}
        name={name}
        step={step}
        min={min}
        max={max}
        list={list}
        onChange={onChange ? (e) => onChange(e) : undefined}
        onFocus={onFocus ? (e) => onFocus(e) : undefined}
        placeholder={placeholder}
        autoComplete={autocomplete ? autocomplete : "off"}
        autoFocus={autoFocus}
        className={cn(
          "text-base block w-full border border-gray-200 rounded text-textPrimary placeholder:text-textSecondary py-1 px-2",
          className
        )}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
