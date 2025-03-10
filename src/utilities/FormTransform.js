
export const formTransform = (value) => {
    return typeof value === "string" ? value.trim().toUpperCase() : value;
};

