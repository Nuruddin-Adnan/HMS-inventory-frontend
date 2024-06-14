import cn from "@/lib/cn";

export default function Textarea({
    name,
    placeholder,
    label,
    inline,
    defaultValue,
    value,
    autocomplete,
    className,
    onChange,
    labelClassName,
    rows,
    readOnly = false
}: {
    name?: string;
    placeholder?: string;
    label?: React.ReactNode | string;
    inline?: boolean;
    defaultValue?: string | number | any;
    value?: string | number | any;
    autocomplete?: string;
    className?: string;
    onChange?: any;
    labelClassName?: string;
    rows?: number;
    readOnly?: boolean
}) {
    function handleChange(event: any) {
        const newValue = event.target.value;
        if (onChange) onChange(newValue);
    }

    return (
        <div
            className={inline ? "sm:flex items-center whitespace-nowrap gap-4" : ""}
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
            <textarea
                name={name}
                defaultValue={defaultValue}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                autoComplete={autocomplete ? autocomplete : "off"}
                rows={rows ? rows : 3}
                readOnly={readOnly}
                className={cn(
                    "text-base block w-full border border-gray-200 rounded text-textPrimary placeholder:text-textSecondary py-1 px-2",
                    className
                )}
            />
        </div>
    );
}
