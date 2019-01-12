/* eslint-disable complexity */

function isBetween(code, lower, upper) {
    return code >= lower && code <= upper;
}

function isInt(code) {
    return isBetween(code, 60, 99) ||
        isBetween(code, 160, 179) ||
        isBetween(code, 270, 289) ||
        isBetween(code, 370, 389) ||
        isBetween(code, 400, 409) ||
        isBetween(code, 420, 429) ||
        isBetween(code, 440, 459) ||
        isBetween(code, 1060, 1071);
}

function isFloat(code) {
    return isBetween(code, 10, 59) ||
        isBetween(code, 110, 149) ||
        isBetween(code, 210, 239) ||
        isBetween(code, 460, 469) ||
        isBetween(code, 1010, 1059);
}

function isBoolean(code) {
    return isBetween(code, 290, 299);
}

/* See page 3 of the DXF 2012 reference */
export function parse(code, value) {
    if (isInt(code)) return parseInt(value, 10);
    if (isFloat(code)) return parseFloat(value);
    if (isBoolean(code)) return Boolean(parseInt(value, 10));

    return value;
}
