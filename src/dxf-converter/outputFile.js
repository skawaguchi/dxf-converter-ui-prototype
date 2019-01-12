export function getOutputFileName(sourceFilePath) {
    const pathParts = sourceFilePath.split('/');

    const lastPart = pathParts[pathParts.length - 1];

    const sourceFileName = lastPart.split('.')[0];

    return `./output/${sourceFileName}.json`;
}
