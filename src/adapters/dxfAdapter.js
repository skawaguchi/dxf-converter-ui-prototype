import { DXFOutput } from '../models/output/DXFOutput';

const getFilteredItems = (filterList, attribute, targetList) => {
    const includedAttributes = filterList.reduce((included, item) => {
        if (item.isSelected) {
            included.push(item[attribute]);
        }
        return included;
    }, []);
    return targetList.filter((item) => includedAttributes.includes(item[attribute]));
};

const getFilteredInsertions = (blocks, insertions) => {
    const blockNames = blocks.map((block) => block.name);

    return insertions.filter((insertion) => blockNames.includes(insertion.blockName));
};

const getFilteredBlocksByLayers = (layers, blocks) => {
    const layerNames = layers.map((layer) => layer.name);

    return blocks.filter((block) => layerNames.includes(block.layerName));
};

const excludedBlockNames = [
    '*Model_Space',
    '*Paper_Space'
];

const getSpacesFilteredBlocks = (blocks) =>
    blocks.filter((block) => !excludedBlockNames.includes(block.name));

const getElements = (dxf, layers, blocks) => {
    const filteredLayersBySelection = getFilteredItems(layers, 'name', dxf.tables.LAYER.entries);
    const filteredBlocksByLayers = getFilteredBlocksByLayers(filteredLayersBySelection, blocks);
    const filteredBlocksBySelection = getFilteredItems(filteredBlocksByLayers, 'handle', dxf.blocks);
    const filteredBlocksBySpace = getSpacesFilteredBlocks(filteredBlocksBySelection);
    const filteredInsertions = getFilteredInsertions(filteredBlocksBySpace, dxf.entities.insertions);

    return {
        blocks: filteredBlocksBySpace,
        insertions: filteredInsertions,
        layers: filteredLayersBySelection
    };
};

const getFilteredNonBlockEntities = (dxf, layers, nonBlockEntities) => {
    if (!nonBlockEntities.isSelected) {
        return [];
    }

    const layerNames = layers.map((layer) => layer.name);

    return dxf.entities.entities.filter((entity) => layerNames.includes(entity.attributes.layerName));
};

export const getSourceJSON = (dxf, layers, blocks, nonBlockEntities) => {
    const filtered = getElements(dxf, layers, blocks);
    const filteredNonBlockEntities = getFilteredNonBlockEntities(dxf, filtered.layers, nonBlockEntities);

    return DXFOutput({
        blocks: filtered.blocks,
        entities: {
            entities: filteredNonBlockEntities,
            insertions: filtered.insertions
        },
        tables: {
            ...dxf.tables,
            LAYER: {
                ...dxf.tables.LAYER,
                entries: filtered.layers
            }
        }
    });
};

const filterLayersForOutput = (layers) =>
    layers.map(({ colorNumber, lineType, name }) => ({
        colorNumber,
        lineType,
        name
    }));

const filterBlockEntitiesForOutput = (entities) =>
    entities.map(({ attributes, handle, type }) => ({
        attributes,
        handle,
        type
    }));

const filterBlocksForOutput = (blocks, insertions) =>
    blocks.map((block) => ({
        ...block,
        entities: filterBlockEntitiesForOutput(block.entities),
        insertions: insertions
            .filter((insertion) => insertion.blockName === block.name)
            .map((insertion) => ({
                handle: insertion.handle,
                x: insertion.x,
                y: insertion.y,
                z: insertion.z,
                xScale: insertion.xScale,
                yScale: insertion.yScale,
                zScale: insertion.zScale
            }))
    }));

export const getOutputJSON = (dxf, layers, blocks, nonBlockEntities) => {
    const filtered = getElements(dxf, layers, blocks);
    const adapterLayers = filterLayersForOutput(filtered.layers);
    const adaptedBlocks = filterBlocksForOutput(filtered.blocks, filtered.insertions);
    const filteredNonBlockEntities = nonBlockEntities.isSelected ?
        filterBlockEntitiesForOutput(dxf.entities.entities) :
        [];

    return {
        blocks: adaptedBlocks,
        layers: adapterLayers,
        nonBlockEntities: filteredNonBlockEntities
    };
};
