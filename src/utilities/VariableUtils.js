export const variableUtils = (value) => {
    return typeof value !== "undefined" && value !== null;

};

export const isValidString = (str) => {
    return str && str.trim() !== "";
};
