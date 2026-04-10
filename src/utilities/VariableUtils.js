

export const isValidString = (str) => {
    return str && str.trim() !== "";
};

export function isset(value) {
    return value !== undefined && value !== null;
}