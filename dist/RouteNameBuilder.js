"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const testPath = (path) => {
    const validPath = /^[\w-.{}]{1,100}$/g;
    if (!validPath.test(path)) {
        throw `Invalid path name detected: ${path}. Valid characters: "a-z A-Z 0-9 _ - ."`;
    }
};
const buildInterface = (obj, stream, indentLevel = 0) => {
    Object.keys(obj).forEach((key) => {
        if (typeof (obj[key]) === 'string') {
            stream.write(`${'\t'.repeat(indentLevel) + key}: string;\n`);
        }
        else {
            stream.write(`${'\t'.repeat(indentLevel) + key}: {\n`);
            buildInterface(obj[key], stream, indentLevel + 1);
            stream.write(`${'\t'.repeat(indentLevel)}};\n`);
        }
    });
};
const buildDirectory = (paths, dir, subDir) => {
    testPath(dir.path);
    const fullPath = [...paths, dir.path].join('/');
    const propName = dir.path
        .replace(/[{}]/g, '')
        .replace(/\./g, '-')
        .split('-')
        .reduce((prev, curr) => prev + curr[0].toLocaleUpperCase() + curr.substr(1));
    subDir[`${propName}Path`] = fullPath;
    if (dir.dirs) {
        subDir[propName] = {};
        dir.dirs.forEach((d) => buildDirectory([...paths, dir.path], d, subDir[propName]));
    }
};
const create = (configPath, filePath = 'Directory.ts') => {
    const ymlFile = fs_1.default.readFileSync(configPath, "utf-8");
    const config = yaml_1.default.parse(ymlFile);
    const directory = { root: '/' };
    config.directory.forEach((dir) => buildDirectory([''], dir, directory));
    const directoryTreeFileName = filePath;
    const fileStream = fs_1.default.createWriteStream(directoryTreeFileName);
    try {
        fileStream.write('/* this file was auto-generated - do not edit directly */\n');
        fileStream.write('/* eslint-disable */\n\n');
        fileStream.write('interface IDirectoryTree {\n');
        buildInterface(directory, fileStream, 1);
        const json = util_1.default.inspect(directory, false, 30);
        fileStream.write('}\n\n');
        fileStream.write(`const directory: IDirectoryTree = ${json};\n\nexport default directory;\n`);
        fileStream.end(() => console.log('Successfully created the file.'));
    }
    catch (e) {
        fileStream.close();
        fs_1.default.unlink(directoryTreeFileName, () => console.log('An error occurred during file creation.\n', e));
        return;
    }
};
exports.create = create;
