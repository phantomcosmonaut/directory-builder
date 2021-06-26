import YAML from 'yaml';
import fs from 'fs';
import util from 'util';

interface IDirectory {
    path: string;
    dirs?: Array<IDirectory>
}

interface IConfig {
    directory: Array<IDirectory>;
}

const testPath = (path: string): void | never => {
    const validPath = /^[\w-.:]{1,100}$/g;

    if (!validPath.test(path)) {
        throw `Invalid path name detected: ${path}. Valid characters: "a-z A-Z 0-9 _ - ."`;
    }
}

const buildDirectory = (paths: Array<string>, dir: IDirectory, subDir: Record<string, unknown>): void => {
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
        dir.dirs.forEach((d: IDirectory) => buildDirectory([...paths, dir.path], d, subDir[propName] as Record<string, unknown>));
    }
};

export const create = (configPath: string, directoryFolder: string = '.'): void => {
    if (!fs.existsSync(directoryFolder)) {
        fs.mkdirSync(directoryFolder);
    }

    const ymlFile = fs.readFileSync(configPath, 'utf-8');
    const config = YAML.parse(ymlFile) as IConfig;
    
    const directory = { rootPath: '/' };
    config.directory.forEach((dir: IDirectory) => buildDirectory([''], dir, directory));
    const template = fs.readFileSync(`${__dirname}/../templates/template.txt`, 'utf-8');
    const output = template.replace('{{ obj }}', util.inspect(directory, false, 30))

    let fileStream;

    try {
        fileStream = fs.createWriteStream(directoryFolder + '/directory.ts');
        fileStream.write(output);
        fileStream.end(() => console.log('Successfully created the file.'));
    }
    catch (e) {
        if (fileStream) {
            fileStream.close();
        }
        
        fs.unlink(directoryFolder, () => console.log('An error occurred during file creation.\n', e));
        return;
    }
};
