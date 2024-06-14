import cn from "@/lib/cn";

export default function Checkbox(
    {
        label,
        htmlFor,
        inlineClassName,
        className,
        labelClassName,
        id,
        name,
        onChange,
        value,
        defaultChecked,
        disabled,
        readOnly = false
    }: {
        label?: React.ReactNode | string,
        htmlFor?: string,
        inlineClassName?: string,
        className?: string,
        labelClassName?: string,
        id?: string,
        name?: string,
        onChange?: any,
        value?: any,
        defaultChecked?: boolean,
        disabled?: boolean,
        readOnly?: boolean,
    }) {



    return (
        <div className={cn(
            "flex gap-1.5",
            inlineClassName
        )}>
            <input
                id={id}
                name={name}
                type="checkbox"
                className={cn(
                    "rounded shadow-sm w-4 h-4",
                    className
                )}
                value={value}
                defaultChecked={defaultChecked}
                onChange={onChange}
                disabled={disabled}
                readOnly={readOnly}
            />

            {label && <label htmlFor={htmlFor} className={cn(
                "text-textPrimary",
                labelClassName
            )}>
                {label}
            </label>}
        </div>
    );
}