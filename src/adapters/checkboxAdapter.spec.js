import { getBlockCheckboxes, getLayerCheckboxes } from './checkboxAdapter';

import { getSelectionLayer, getSelectionBlock } from '../mockUtils';

describe('layerAdapter', () => {
    it('should get layers adapted to checkboxes', () => {
        const layerMock = getSelectionLayer();
        const layerListMock = [
            layerMock
        ];

        const adaptedList = getLayerCheckboxes(layerListMock);

        const adaptedModel = adaptedList[0];

        expect(adaptedModel.id).toEqual(layerMock.name);
        expect(adaptedModel.isSelected).toEqual(layerMock.isSelected);
        expect(adaptedModel.label).toEqual(layerMock.name);
        expect(adaptedModel.value).toEqual(layerMock.name);
    });

    it('should get blocks adapted to checkboxes', () => {
        const blockMock = getSelectionBlock();
        const blockListMock = [
            blockMock
        ];

        const adaptedList = getBlockCheckboxes(blockListMock);

        const adaptedModel = adaptedList[0];

        expect(adaptedModel.id).toEqual(blockMock.handle);
        expect(adaptedModel.isSelected).toEqual(blockMock.isSelected);
        expect(adaptedModel.label).toEqual(blockMock.name);
        expect(adaptedModel.value).toEqual(blockMock.name);
    });
});

