export const buildPath = (fullPath: string, ...params: Array<string>): string | never => {
    const matches = fullPath.match(/(:[\w.]*)/g);
    if (matches?.length !== params.length) {
        throw `Incorrect number of params provided for path: ${fullPath}`;
    }

    params.reverse();
    return fullPath
        .split('/')
        .map((section: string) => section.startsWith(':') ? params.pop() || '' : section)
        .join('/');
};
