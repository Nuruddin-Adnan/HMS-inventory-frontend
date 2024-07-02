export const reactSelectStyles = {
    control: (baseStyles: any) => ({
        ...baseStyles,
        minHeight: "auto",
        color: "#18181B",
        padding: "0px",
        border: "1px solid #e5e7eb",
    }),
    indicatorsContainer: (provided: any) => ({
        ...provided,
        padding: "0px",
        minHeight: "auto",
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: "0px 4px",
    }),
};