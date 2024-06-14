import cn from "@/lib/cn";

export default function Select({
    options,
    title = '-- select one --',
    name,
    label,
    inline,
    defaultValue,
    value,
    className,
    onChange,
    labelClassName,
    disabled = false,
    required = false,
}: {
    options: { title: string, value: any }[];
    title?: string;
    name?: string;
    label?: React.ReactNode | string;
    inline?: boolean;
    defaultValue?: string | number;
    value?: string | number;
    className?: string;
    onChange?: any;
    labelClassName?: string;
    disabled?: boolean
    required?: boolean
}) {

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
            <select
                defaultValue={defaultValue}
                value={value}
                name={name}
                onChange={onChange ? (e) => onChange(e) : undefined}
                className={cn(
                    "text-base block w-full border border-gray-200 rounded text-textPrimary placeholder:text-textSecondary py-1 px-2",
                    className
                )}
                disabled={disabled}
                required={required}
            >
                <option value="" >{title}</option>
                {
                    options.map((item: any, index: number) => (
                        <option key={index} value={item.value}>{item.title}</option>
                    ))
                }
            </select>

        </div>
    );
}
