const getInsertionEntityHandlesByBlockName = (insertions, block) =>
    insertions.reduce((insertHandleList, insert) => {
        if (insert.blockName === block.name) {
            const handles = block.entities.map((entity) => `${insert.handle}-${entity.handle}`);

            return insertHandleList.concat(handles);
        }
        return insertHandleList;
    }, []);

export const getBlockInsertions = (dxf, blockName) => {
    const targetBlock = dxf.blocks.find((block) => block.name === blockName);

    return getInsertionEntityHandlesByBlockName(dxf.entities.insertions, targetBlock);
};

const getLayerInsertions = (dxf, layerName) =>
    dxf.blocks.filter((block) => block.layerName === layerName)
        .reduce((blockHandleList, block) => {
            const insertionHandles = getInsertionEntityHandlesByBlockName(dxf.entities.insertions, block);

            return blockHandleList.concat(insertionHandles);
        }, []);

const getLayerEntityHandles = (target, layerName) =>
    target.reduce((entityAccumulator, entity) => {
        if (entity.attributes && entity.attributes.layerName === layerName) {
            entityAccumulator.push(entity.handle);
        }
        return entityAccumulator;
    }, []);

const getLayerBlockEntities = (dxf, layerName) => {
    const blockHandles = dxf.blocks.reduce((blockAccumulator, block) => {
        const matchingAttributeHandles = getLayerEntityHandles(block.entities, layerName);

        blockAccumulator = blockAccumulator.concat(matchingAttributeHandles);

        return blockAccumulator;
    }, []);


    const entitiesHandles = getLayerEntityHandles(dxf.entities.entities, layerName);

    return blockHandles.concat(entitiesHandles);
};

export const getLayerInsertionsAndEntities = (dxf, layerName) =>
    getLayerBlockEntities(dxf, layerName).concat(getLayerInsertions(dxf, layerName));

export const getNonBlockEntities = (dxf) =>
    dxf.entities.entities.map((entity) => entity.handle);
