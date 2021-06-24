"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPath = void 0;
const buildPath = (fullPath, params) => {
    const matches = /(:[\w.]*)/g.exec(fullPath);
    if (matches?.length !== params.length) {
        throw `Incorrect number of params provided for path: ${fullPath}`;
    }
    params.reverse();
    return fullPath
        .split('/')
        .map((section) => section.startsWith(':') ? params.pop() ?? '' : section)
        .join('/');
};
exports.buildPath = buildPath;
