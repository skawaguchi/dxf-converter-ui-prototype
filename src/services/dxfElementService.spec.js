import {
    getBlockInsertions,
    getLayerInsertionsAndEntities,
    getNonBlockEntities
} from './dxfElementService';

import {
    getBlock,
    getDXFDataModel,
    getEntity,
    getInsert,
    getRandomAttributes
} from '../mockUtils';

describe('Find DXF Elements Service', () => {
    it('should get insertions matching a block name', () => {
        const blockName = 'some-block';
        const insertHandle = 'some-insert';
        const entityHandle = 'some-entity';

        const entityMock = getEntity({
            handle: entityHandle
        });

        const blockMock = getBlock({
            entities: [
                entityMock
            ],
            name: blockName
        });

        const insertMock = getInsert({
            blockName,
            handle: insertHandle
        });

        const dxfDataMock = getDXFDataModel({
            blocks: [
                blockMock
            ],
            entities: {
                entities: [],
                insertions: [
                    getInsert(),
                    insertMock
                ]
            }
        });

        const blockInsertions = getBlockInsertions(dxfDataMock, blockName);

        expect(blockInsertions).toEqual([`${insertHandle}-${entityHandle}`]);
    });

    it('should get insertions matching a layer name', () => {
        const layerName = 'some-layer-name';
        const blockName = 'some-block';
        const insertHandle = 'some-insert';
        const entityHandle = 'some-entity';

        const otherBlockName = 'some-other-block';
        const otherInsertHandle = 'some-other-insert';
        const otherEntityHandle = 'some-other-entity';

        const blockMock = getBlock({
            entities: [
                getEntity({
                    handle: entityHandle
                })
            ],
            name: blockName,
            layerName
        });

        const otherBlockMock = getBlock({
            entities: [
                getEntity({
                    handle: otherEntityHandle
                })
            ],
            name: otherBlockName,
            layerName
        });

        const insertMock = getInsert({
            blockName,
            handle: insertHandle
        });

        const otherInsertMock = getInsert({
            blockName: otherBlockName,
            handle: otherInsertHandle
        });

        const dxfDataMock = getDXFDataModel({
            blocks: [
                blockMock,
                otherBlockMock,
                getBlock()
            ],
            entities: {
                entities: [],
                insertions: [
                    getInsert(),
                    insertMock,
                    otherInsertMock
                ]
            }
        });

        const layerInsertions = getLayerInsertionsAndEntities(dxfDataMock, layerName);

        expect(layerInsertions).toEqual([
            `${insertHandle}-${entityHandle}`,
            `${otherInsertHandle}-${otherEntityHandle}`
        ]);
    });

    it('should get block attribute handles matching a layer name', () => {
        const layerName = 'some-layer-name';
        const entityHandle = 'some-entity';
        const otherEntityHandle = 'some-other-entity';

        const blockSomeMatchingEntitiesMock = getBlock({
            entities: [
                getEntity({
                    attributes: getRandomAttributes({
                        layerName
                    }),
                    handle: entityHandle
                }),
                getEntity({
                    attributes: getRandomAttributes({
                        layerName: 'some-other-layer'
                    })
                })
            ],
            layerName: 'some-other-layer'
        });

        const blockAllMatchingEntitiesMock = getBlock({
            layerName,
            entities: [
                getEntity({
                    attributes: getRandomAttributes({
                        layerName
                    }),
                    handle: otherEntityHandle
                })
            ]
        });

        const dxfDataMock = getDXFDataModel({
            blocks: [
                blockSomeMatchingEntitiesMock,
                blockAllMatchingEntitiesMock,
                getBlock()
            ],
            entities: {
                entities: [],
                insertions: []
            }
        });

        const layerAttributes = getLayerInsertionsAndEntities(dxfDataMock, layerName);

        expect(layerAttributes).toEqual([
            entityHandle,
            otherEntityHandle
        ]);
    });

    it('should get entities > entity attribute handles matching a layer name', () => {
        const layerName = 'some-layer-name';
        const attributeHandle = 'some-attribute';

        const matchingEntityMock = getEntity({
            attributes: getRandomAttributes({
                layerName
            }),
            handle: attributeHandle
        });

        const dxfDataMock = getDXFDataModel({
            blocks: [],
            entities: {
                entities: [
                    matchingEntityMock,
                    getEntity()
                ],
                insertions: []
            }
        });

        const layerAttributes = getLayerInsertionsAndEntities(dxfDataMock, layerName);

        expect(layerAttributes).toEqual([
            attributeHandle
        ]);
    });

    it('should get non-block entities', () => {
        const entityHandle = 'some-handle';

        const entityMock = getEntity({
            handle: entityHandle
        });

        const dxfDataMock = getDXFDataModel({
            blocks: [],
            entities: {
                entities: [
                    entityMock
                ],
                insertions: []
            }
        });

        const handles = getNonBlockEntities(dxfDataMock);

        expect(handles).toEqual([
            entityHandle
        ]);
    });
});

