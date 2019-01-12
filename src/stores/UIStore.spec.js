import sinon from 'sinon';

import { UIStore } from './UIStore';

import { DXFData } from '../models/DXFData';
import { DXFFile } from '../models/DXFFile';

import {
    getBlock,
    getDXFData,
    getEntity,
    getRawDXFFile,
    getLayerEntry,
    getNonBlockEntities,
    getSelectionBlock,
    getSelectionLayer
} from '../mockUtils';

const sandbox = sinon.sandbox.create();

describe('User Interface Domain Store', () => {
    function getStore() {
        return new UIStore();
    }

    afterEach(() => {
        sandbox.restore();
    });

    describe('Actions', () => {
        it('should store the raw dxf file content', () => {
            const store = getStore();

            const textMock = 'some text';

            store.setRawFileText(textMock);

            expect(store.rawFileText).toEqual(textMock);
        });

        it('should show the page error', () => {
            const store = getStore();

            const errorMock = 'some error';

            store.setPageError(errorMock);

            expect(store.pageError).toEqual(errorMock);
        });

        it('should set the save file callback', () => {
            const store = getStore();

            const callback = sandbox.stub();

            store.setSaveDXFFileCallback(callback);

            store.saveDXFFile();

            sandbox.assert.calledOnce(callback);
        });

        it('should set the selections', () => {
            const store = getStore();

            const blocks = [
                getSelectionLayer({
                    isSelected: false
                })
            ];

            const layers = [
                getSelectionBlock({
                    isSelected: false
                })
            ];

            const nonBlockEntities = [
                getNonBlockEntities({
                    isSelected: false
                })
            ];

            store.setSelections(blocks, layers, nonBlockEntities);

            expect(store.blocks[0].isSelected).toEqual(blocks[0].isSelected);
            expect(store.layers[0].isSelected).toEqual(layers[0].isSelected);
            expect(store.nonBlockEntities.isSelected).toEqual(nonBlockEntities.isSelected);
        });

        describe('Given dxf data', () => {
            it('should store the file data and strip the file extension', () => {
                const store = getStore();

                const dxfFile = getRawDXFFile();

                store.setDxf(dxfFile, getDXFData());

                const fileModel = store.file;
                const expectedTitle = dxfFile.name.substring(0, dxfFile.name.lastIndexOf('.'));

                expect(DXFFile.is(fileModel)).toEqual(true);
                expect(fileModel.title).toContain(expectedTitle);
                expect(fileModel.title).not.toContain('.dxf');
            });

            it('should not strip file extensions if they are not present', () => {
                const store = getStore();

                const dxfFile = getRawDXFFile({
                    name: 'file-name-without-dxf-extension'
                });

                store.setDxf(dxfFile, getDXFData());

                const fileModel = store.file;

                expect(DXFFile.is(fileModel)).toEqual(true);
                expect(fileModel.title).toContain(dxfFile.name);
                expect(fileModel.title).not.toContain('.dxf');
            });

            it('should change the dxf file title', () => {
                const store = getStore();

                store.setDxf(getRawDXFFile(), getDXFData());

                const valueMock = 'some value';

                store.setDXFTitle(valueMock);

                expect(store.file.title).toEqual(valueMock);
            });

            it('should store the converted dxf data', () => {
                const store = getStore();

                store.setDxf(getRawDXFFile(), getDXFData());

                const dxfModel = store.dxf;

                expect(DXFData.is(dxfModel)).toEqual(true);
            });

            it('should initialize the block selections', () => {
                const store = getStore();

                const blockMock = getBlock();

                const convertedDXFData = getDXFData({
                    blocks: [
                        blockMock
                    ],
                    entities: {
                        entities: [],
                        insertions: []
                    },
                    tables: {
                        LAYER: {
                            entries: []
                        }
                    }
                });

                store.setDxf(getRawDXFFile(), convertedDXFData);

                const adaptedBlock = store.blocks[0];

                expect(adaptedBlock.isSelected).toEqual(true);
                expect(adaptedBlock.handle).toEqual(blockMock.handle);
                expect(adaptedBlock.layerName).toEqual(blockMock.layerName);
                expect(adaptedBlock.name).toEqual(blockMock.name);
                expect(adaptedBlock.x).toEqual(blockMock.x);
                expect(adaptedBlock.y).toEqual(blockMock.y);
                expect(adaptedBlock.z).toEqual(blockMock.z);
            });

            it('should filter out model and paper blocks from the selections', () => {
                const store = getStore();

                const modelBlockName = '*Model_Space';
                const paperBlockName = '*Paper_Space';

                const modelBlockMock = getBlock({
                    name: modelBlockName
                });

                const paperBlockMock = getBlock({
                    name: paperBlockName
                });

                const convertedDXFData = getDXFData({
                    blocks: [
                        modelBlockMock,
                        paperBlockMock
                    ],
                    entities: {
                        entities: [],
                        insertions: []
                    },
                    tables: {
                        LAYER: {
                            entries: []
                        }
                    }
                });

                store.setDxf(getRawDXFFile(), convertedDXFData);

                const adaptedBlockNames = store.blocks.map((block) => block.name);

                expect(adaptedBlockNames).not.toContain(modelBlockName);
                expect(adaptedBlockNames).not.toContain(paperBlockName);
            });

            it('should initialize the layer selections', () => {
                const store = getStore();
                const layerMock = getLayerEntry();

                const convertedDXFData = getDXFData({
                    blocks: [],
                    entities: {
                        entities: [],
                        insertions: []
                    },
                    tables: {
                        LAYER: {
                            entries: [
                                layerMock
                            ]
                        }
                    }
                });

                store.setDxf(getRawDXFFile(), convertedDXFData);

                const adaptedLayer = store.layers[0];

                expect(adaptedLayer.isSelected).toEqual(true);
                expect(adaptedLayer.colorNumber).toEqual(layerMock.colorNumber);
                expect(adaptedLayer.lineType).toEqual(layerMock.lineType);
                expect(adaptedLayer.name).toEqual(layerMock.name);
            });

            it('should initialize the entity selections', () => {
                const store = getStore();
                const entityMock = getEntity();

                const convertedDXFData = getDXFData({
                    blocks: [],
                    entities: {
                        entities: [
                            entityMock
                        ],
                        insertions: []
                    },
                    tables: {
                        LAYER: {
                            entries: []
                        }
                    }
                });

                store.setDxf(getRawDXFFile(), convertedDXFData);

                const adaptedNonBlockEntities = store.nonBlockEntities;

                expect(adaptedNonBlockEntities.isSelected).toEqual(true);

                const adaptedEntity = adaptedNonBlockEntities.entities[0];

                expect(Object.assign({}, adaptedEntity.attributes)).toEqual(Object.assign({}, entityMock.attributes));
                expect(adaptedEntity.handle).toEqual(entityMock.handle);
                expect(adaptedEntity.space).toEqual(entityMock.space);
                expect(adaptedEntity.type).toEqual(entityMock.type);
            });

            it('should change the block selections', () => {
                const store = getStore();

                const blockMock = getBlock();

                const convertedDXFData = getDXFData({
                    blocks: [
                        blockMock
                    ],
                    entities: {
                        entities: [],
                        insertions: []
                    },
                    tables: {
                        LAYER: {
                            entries: []
                        }
                    }
                });

                store.setDxf(getRawDXFFile(), convertedDXFData);

                const block = store.blocks[0];

                const expectedSelectionValue = !block.isSelected;

                store.changeBlockSelection(block.handle);

                expect(store.blocks[0].isSelected).toEqual(expectedSelectionValue);
            });

            it('should change the layer selections', () => {
                const store = getStore();

                const layerMock = getLayerEntry();

                const convertedDXFData = getDXFData({
                    blocks: [],
                    entities: {
                        entities: [],
                        insertions: []
                    },
                    tables: {
                        LAYER: {
                            entries: [
                                layerMock
                            ]
                        }
                    }
                });

                store.setDxf(getRawDXFFile(), convertedDXFData);

                const layer = store.layers[0];

                const expectedSelectionValue = !layer.isSelected;

                store.changeLayerSelection(layer.name);

                expect(store.layers[0].isSelected).toEqual(expectedSelectionValue);
            });

            it('should change the non-block entity selection', () => {
                const store = getStore();

                const convertedDXFData = getDXFData({
                    blocks: [],
                    entities: {
                        entities: [],
                        insertions: []
                    },
                    tables: {
                        LAYER: {
                            entries: []
                        }
                    }
                });

                store.setDxf(getRawDXFFile(), convertedDXFData);

                const expectedSelectionValue = false;

                store.toggleNonBlockEntitiesSelection();

                expect(store.nonBlockEntities.isSelected).toEqual(expectedSelectionValue);
            });
        });
    });
});
