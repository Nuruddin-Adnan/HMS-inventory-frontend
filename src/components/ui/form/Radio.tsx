import cn from "@/lib/cn";

export default function Radio(
    {

        label,
        className,
        labelClassName,
        name,
        onChange,
        value,
        defaultChecked,
    }: {
        label?: React.ReactNode | string,
        className?: string,
        labelClassName?: string,
        name?: string,
        onChange?: any,
        value?: any,
        defaultChecked?: boolean,
    }) {



    return (
        <div className="flex gap-1.5">
            <input
                name={name}
                type="radio"
                className={cn(
                    "rounded-full shadow-sm",
                    className
                )}
                value={value}
                defaultChecked={defaultChecked}
                onChange={onChange} />
            {label && <label className={cn(
                "block text-sm font-medium text-gray-900",
                labelClassName
            )}>
                {label}
            </label>}
        </div>
    );
}