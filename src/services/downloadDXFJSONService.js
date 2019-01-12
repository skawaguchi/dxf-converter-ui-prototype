import { saveAs } from 'file-saver';

export const downloadDXFJSON = (fileName, dxfJSON) => {
    const stringifiedJSON = JSON.stringify(dxfJSON, null, 4);
    const file = new File([stringifiedJSON], fileName, {
        type: 'application/json;charset=utf-8'
    });

    saveAs(file);
};
