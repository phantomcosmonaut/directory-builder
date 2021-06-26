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
    const validPath = /^[\w-.:]{1,100}$/g;
    if (!validPath.test(path)) {
        throw `Invalid path name detected: ${path}. Valid characters: "a-z A-Z 0-9 _ - ."`;
    }
};
const buildDirectory = (paths, dir, subDir) => {
    testPath(dir.path);
    const fullPath = [...paths, dir.path].join('/');
    const propName = dir.path
        .replace(/[:]/g, '')
        .replace(/\./g, '-')
        .split('-')
        .reduce((prev, curr) => prev + curr[0].toLocaleUpperCase() + curr.substr(1));
    subDir[`${propName}Path`] = fullPath;
    if (dir.dirs) {
        subDir[propName] = {};
        dir.dirs.forEach((d) => buildDirectory([...paths, dir.path], d, subDir[propName]));
    }
};
const create = (configPath, directoryFolder = '.') => {
    if (!fs_1.default.existsSync(directoryFolder)) {
        fs_1.default.mkdirSync(directoryFolder);
    }
    const ymlFile = fs_1.default.readFileSync(configPath, "utf-8");
    const config = yaml_1.default.parse(ymlFile);
    const directory = { rootPath: '/' };
    config.directory.forEach((dir) => buildDirectory([''], dir, directory));
    const fileStream = fs_1.default.createWriteStream(directoryFolder + '/directory.ts');
    try {
        fileStream.write('/* this file was generated using directory-builder - do not edit directly */\n');
        fileStream.write('/* eslint-disable */\n\n');
        const json = util_1.default.inspect(directory, false, 30);
        fileStream.write(`const directory = ${json} as const;\n\nexport default directory;\n`);
        fileStream.end(() => console.log('Successfully created the file.'));
    }
    catch (e) {
        fileStream.close();
        fs_1.default.unlink(directoryFolder, () => console.log('An error occurred during file creation.\n', e));
        return;
    }
};
exports.create = create;
