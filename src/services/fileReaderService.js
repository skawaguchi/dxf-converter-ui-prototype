import { processFile } from '../dxf-converter/process';

import { pageErrorTypes } from '../constants/pageErrors';

const isInvalid = (convertedJSON) => !convertedJSON.blocks || !convertedJSON.tables;

export function getFileChangeHandler(store) {
    return (files) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const { result } = event.target;

            const convertedJSON = processFile(result);

            if (isInvalid(convertedJSON)) {
                return store.setPageError(pageErrorTypes.DXF_READ_ERROR);
            }

            store.setRawFileText(result);

            store.setDxf(files[0], convertedJSON);

            return store.setPageError(null);
        };

        reader.readAsText(files[0], {
            type: 'text/plain'
        });
    };
}
