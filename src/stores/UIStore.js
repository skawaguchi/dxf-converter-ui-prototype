import {
    action,
    observable
} from 'mobx';

import { DXFData } from '../models/DXFData';
import { DXFFile } from '../models/DXFFile';

const excludedBlockNames = [
    '*Model_Space',
    '*Paper_Space'
];

function getInitialBlocks(json) {
    return json.blocks
        .filter((block) => !excludedBlockNames.includes(block.name))
        .map((block) => ({
            isSelected: true,
            handle: block.handle,
            layerName: block.layerName,
            name: block.name,
            x: block.x,
            y: block.y,
            z: block.z
        }));
}

function getInitialLayers(json) {
    const layers = json.tables.LAYER.entries;

    return layers.map((layer) => ({
        colorNumber: layer.colorNumber,
        isSelected: true,
        lineType: layer.lineType,
        name: layer.name,
        plottingFlag: layer.plottingFlag
    }));
}

function getInitialNonBlockEntities(json) {
    const { entities } = json.entities;

    return {
        isSelected: true,
        entities: entities.map((entity) => ({
            attributes: entity.attributes,
            handle: entity.handle,
            space: entity.space,
            type: entity.type
        }))
    };
}


function stripFileExtension(title) {
    const dotIndex = title.lastIndexOf('.');

    if (dotIndex > 0) {
        return title.substring(0, dotIndex);
    }

    return title;
}

export class UIStore {
    @observable pageError;

    @observable layers;
    @observable blocks;
    @observable nonBlockEntities;

    @observable dxf;
    @observable file;
    @observable rawFileText;

    @observable saveDXFFile;

    @action
    setRawFileText(text) {
        this.rawFileText = text;
    }

    @action
    setPageError(errorType) {
        this.pageError = errorType;
    }

    @action
    setDXFTitle(title) {
        this.file = DXFFile.update(this.file, {
            title: {
                $set: title
            }
        });
    }

    @action
    setSaveDXFFileCallback(fn) {
        this.saveDXFFile = fn;
    }

    setFileData = (fileData) => {
        const {
            lastModified,
            lastModifiedDate,
            name,
            size
        } = fileData;

        this.file = DXFFile({
            lastModified,
            lastModifiedDate,
            name,
            size,
            title: stripFileExtension(name)
        });
    };

    initializeUIData = (dxfData) => {
        this.blocks = getInitialBlocks(dxfData);
        this.layers = getInitialLayers(dxfData);
        this.nonBlockEntities = getInitialNonBlockEntities(dxfData);
    };

    @action
    setDxf(fileData, convertedDXFData) {
        this.setFileData(fileData);

        const dxfData = DXFData(convertedDXFData);

        this.dxf = dxfData;

        this.initializeUIData(dxfData);
    }

    @action
    setSelections(blocks, layers, nonBlockEntities) {
        this.layers = layers;
        this.blocks = blocks;
        this.nonBlockEntities = nonBlockEntities;
    }

    @action
    changeBlockSelection(id) {
        const index = this.blocks.findIndex((block) => block.handle === id);

        const toggledSelectionValue = !this.blocks[index].isSelected;

        this.blocks[index].isSelected = toggledSelectionValue;
    }

    @action
    changeLayerSelection(id) {
        const index = this.layers.findIndex((layer) => layer.name === id);

        const toggledSelectionValue = !this.layers[index].isSelected;

        this.layers[index].isSelected = toggledSelectionValue;
    }

    @action
    toggleNonBlockEntitiesSelection() {
        this.nonBlockEntities.isSelected = !this.nonBlockEntities.isSelected;
    }
}
