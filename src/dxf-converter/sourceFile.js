export function getSourceFilePath() {
    return process.argv.reduce((filePath, arg, index) => {
        if (arg === '-f' || arg === '--file') {
            return process.argv[index + 1];
        }
        return filePath;
    }, './dxf-samples/sample.dxf');
}
