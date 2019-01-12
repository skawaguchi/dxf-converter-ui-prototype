import {
    getOutputJSON,
    getSourceJSON
} from './dxfAdapter';

import {
    getBlock,
    getDXFDataModel,
    getEntity,
    getInsert,
    getLayerEntry,
    getNonBlockEntities, getRandomAttributes,
    getSelectionBlock,
    getSelectionLayer,
    getTable
} from '../mockUtils';

describe('dxfAdapter', () => {
    describe('source json adapter', () => {
        it('should filter out blocks that are not selected', () => {
            const includedLayerName = 'included-layer-name';
            const excludedBlockHandle = 'excluded-block-handle';
            const includedBlockHandle = 'included-block-handle';

            const layerSelections = [
                getSelectionLayer({
                    name: includedLayerName,
                    isSelected: true
                })
            ];

            const blockSelections = [
                getSelectionBlock({
                    handle: excludedBlockHandle,
                    isSelected: false,
                    layerName: includedLayerName
                }),
                getSelectionBlock({
                    handle: includedBlockHandle,
                    isSelected: true,
                    layerName: includedLayerName
                })
            ];

            const dxfMock = getDXFDataModel({
                blocks: [
                    getBlock({
                        handle: excludedBlockHandle
                    }),
                    getBlock({
                        handle: includedBlockHandle
                    })
                ],
                tables: getTable({
                    LAYER: {
                        entries: [
                            getLayerEntry({
                                name: includedLayerName
                            })
                        ]
                    }
                })
            });

            const adaptedData = getSourceJSON(dxfMock, layerSelections, blockSelections, {});
            const listOfBlockHandles = adaptedData.blocks.map((block) => block.handle);

            expect(listOfBlockHandles).not.toContain(excludedBlockHandle);
            expect(listOfBlockHandles).toContain(includedBlockHandle);
        });

        it('should filter out the model and paper blocks', () => {
            const includedLayerName = 'included-layer-name';
            const modelBlockName = '*Model_Space';
            const paperBlockName = '*Paper_Space';

            const layerSelections = [
                getSelectionLayer({
                    name: includedLayerName,
                    isSelected: true
                })
            ];

            const modelBlock = getSelectionBlock({
                isSelected: true,
                layerName: includedLayerName,
                name: modelBlockName
            });

            const paperBlock = getSelectionBlock({
                isSelected: true,
                layerName: includedLayerName,
                name: paperBlockName
            });

            const blockSelections = [
                modelBlock,
                paperBlock
            ];

            const dxfMock = getDXFDataModel({
                blocks: [
                    getBlock({
                        handle: modelBlock.handle,
                        name: modelBlockName
                    }),
                    getBlock({
                        handle: paperBlock.handle,
                        name: paperBlockName
                    })
                ],
                tables: getTable({
                    LAYER: {
                        entries: [
                            getLayerEntry({
                                name: includedLayerName
                            })
                        ]
                    }
                })
            });

            const adaptedData = getSourceJSON(dxfMock, layerSelections, blockSelections, {});
            const listOfBlockNames = adaptedData.blocks.map((block) => block.name);

            expect(listOfBlockNames).not.toContain(modelBlockName);
            expect(listOfBlockNames).not.toContain(paperBlockName);
        });

        it('should filter out block insertions that are not selected', () => {
            const includedLayerName = 'included-layer-name';

            const excludedBlockName = 'excluded-block-name';
            const excludedBlockHandle = 'excluded-block-handle';
            const excludedInsertionHandle = 'excluded-insertion-handle';

            const includedBlockName = 'included-block-name';
            const includedBlockHandle = 'included-block-handle';
            const includedInsertionHandle = 'included-insertion-handle';

            const layerSelections = [
                getSelectionLayer({
                    name: includedLayerName,
                    isSelected: true
                })
            ];

            const blockSelections = [
                getSelectionBlock({
                    handle: excludedBlockHandle,
                    name: excludedBlockName,
                    isSelected: false,
                    layerName: includedLayerName
                }),
                getSelectionBlock({
                    handle: includedBlockHandle,
                    name: includedBlockName,
                    isSelected: true,
                    layerName: includedLayerName
                })
            ];

            const dxfMock = getDXFDataModel({
                blocks: [
                    getBlock({
                        handle: excludedBlockHandle,
                        name: excludedBlockName
                    }),
                    getBlock({
                        handle: includedBlockHandle,
                        name: includedBlockName
                    })
                ],
                entities: {
                    entities: [],
                    insertions: [
                        getInsert({
                            blockName: excludedBlockName,
                            handle: excludedInsertionHandle
                        }),
                        getInsert({
                            blockName: includedBlockName,
                            handle: includedInsertionHandle
                        })
                    ]
                },
                tables: getTable({
                    LAYER: {
                        entries: [
                            getLayerEntry({
                                name: includedLayerName
                            })
                        ]
                    }
                })
            });

            const adaptedData = getSourceJSON(dxfMock, layerSelections, blockSelections, {});
            const listOfInsertionHandles = adaptedData.entities.insertions.map((insertion) => insertion.handle);

            expect(listOfInsertionHandles).not.toContain(excludedInsertionHandle);
            expect(listOfInsertionHandles).toContain(includedInsertionHandle);
        });

        it('should include entities', () => {
            const dxfMock = getDXFDataModel();
            const nonBlockEntitiesSelections = getNonBlockEntities({
                isSelected: true
            });

            const adaptedData = getSourceJSON(dxfMock, [], [], nonBlockEntitiesSelections);

            expect(adaptedData.entities.entities).toEqual(dxfMock.entities.entities);
        });

        it('should filter out layers that are not selected', () => {
            const excludedLayerName = 'someName';
            const includedLayerName = 'someOtherName';

            const layerSelections = [
                getSelectionLayer({
                    isSelected: false,
                    name: excludedLayerName
                }),
                getSelectionLayer({
                    isSelected: true,
                    name: includedLayerName
                })
            ];

            const dxfMock = getDXFDataModel({
                tables: getTable({
                    LAYER: {
                        entries: [
                            getLayerEntry({
                                name: excludedLayerName
                            }),
                            getLayerEntry({
                                name: includedLayerName
                            })
                        ]
                    }
                })
            });

            const adaptedData = getSourceJSON(dxfMock, layerSelections, [], {});
            const listOfLayerNames = adaptedData.tables.LAYER.entries.map((layer) => layer.name);

            expect(listOfLayerNames).not.toContain(excludedLayerName);
            expect(listOfLayerNames).toContain(includedLayerName);
        });

        it('should filter out blocks whose layers are not selected', () => {
            const excludedBlockHandle = 'excluded-block-handle';

            const includedLayerName = 'included-layer-name';
            const includedBlockHandle = 'included-block-handle';

            const layerSelections = [
                getSelectionLayer({
                    isSelected: true,
                    name: includedLayerName
                })
            ];

            const blockSelections = [
                getSelectionBlock({
                    handle: excludedBlockHandle,
                    isSelected: false,
                    layerName: includedLayerName
                }),
                getSelectionBlock({
                    handle: includedBlockHandle,
                    isSelected: true,
                    layerName: includedLayerName
                })
            ];

            const dxfMock = getDXFDataModel({
                blocks: [
                    getBlock({
                        handle: excludedBlockHandle
                    }),
                    getBlock({
                        handle: includedBlockHandle
                    })
                ],
                tables: getTable({
                    LAYER: {
                        entries: [
                            getLayerEntry({
                                name: includedLayerName
                            })
                        ]
                    }
                })
            });

            const adaptedData = getSourceJSON(dxfMock, layerSelections, blockSelections, {});
            const listOfBlockHandles = adaptedData.blocks.map((block) => block.handle);

            expect(listOfBlockHandles).not.toContain(excludedBlockHandle);
            expect(listOfBlockHandles).toContain(includedBlockHandle);
        });

        it('should not filter out blocks whose layers are selected', () => {
            const includedLayerName = 'included-layer-name';
            const includedBlockHandle = 'included-block-handle';

            const layerSelections = [
                getSelectionLayer({
                    isSelected: true,
                    name: includedLayerName
                })
            ];

            const blockSelections = [
                getSelectionBlock({
                    handle: includedBlockHandle,
                    isSelected: true,
                    layerName: includedLayerName
                })
            ];

            const dxfMock = getDXFDataModel({
                blocks: [
                    getBlock({
                        handle: includedBlockHandle
                    })
                ],
                tables: getTable({
                    LAYER: {
                        entries: [
                            getLayerEntry({
                                name: includedLayerName
                            })
                        ]
                    }
                })
            });

            const adaptedData = getSourceJSON(dxfMock, layerSelections, blockSelections, {});
            const listOfBlockHandles = adaptedData.blocks.map((block) => block.handle);

            expect(listOfBlockHandles).toContain(includedBlockHandle);
        });

        it('should filter out non-block entities by layer', () => {
            const includedLayerName = 'included-layer-name';
            const excludedLayerName = 'excluded-layer-name';
            const includedNonBlockEntityHandle = 'included-entity-handle';
            const excludedNonBlockEntityHandle = 'excluded-entity-handle';

            const layerSelections = [
                getSelectionLayer({
                    isSelected: true,
                    name: includedLayerName
                }),
                getSelectionLayer({
                    isSelected: false,
                    name: excludedLayerName
                })
            ];

            const nonBlockEntitiesSelections = getNonBlockEntities({
                isSelected: true
            });

            const dxfMock = getDXFDataModel({
                blocks: [],
                entities: {
                    entities: [
                        getEntity({
                            attributes: getRandomAttributes({
                                layerName: includedLayerName
                            }),
                            handle: includedNonBlockEntityHandle
                        }),
                        getEntity({
                            attributes: getRandomAttributes({
                                layerName: excludedLayerName
                            }),
                            handle: excludedNonBlockEntityHandle
                        })
                    ],
                    insertions: []
                },
                tables: getTable({
                    LAYER: {
                        entries: [
                            getLayerEntry({
                                name: includedLayerName
                            }),
                            getLayerEntry({
                                name: excludedLayerName
                            })
                        ]
                    }
                })
            });

            const adaptedData = getSourceJSON(dxfMock, layerSelections, [], nonBlockEntitiesSelections);
            const listOfEntityHandles = adaptedData.entities.entities.map((entity) => entity.handle);

            expect(listOfEntityHandles).not.toContain(excludedNonBlockEntityHandle);
            expect(listOfEntityHandles).toContain(includedNonBlockEntityHandle);
        });

        it('should filter out non-block entities', () => {
            const excludedNonBlockEntityHandle = 'included-entity-handle';

            const nonBlockEntitiesSelections = getNonBlockEntities({
                isSelected: false
            });

            const dxfMock = getDXFDataModel({
                blocks: [],
                entities: {
                    entities: [
                        getEntity({
                            handle: excludedNonBlockEntityHandle
                        })
                    ],
                    insertions: []
                },
                tables: getTable()
            });

            const adaptedData = getSourceJSON(dxfMock, [], [], nonBlockEntitiesSelections);
            const listOfEntityHandles = adaptedData.entities.entities.map((entity) => entity.handle);

            expect(listOfEntityHandles).not.toContain(excludedNonBlockEntityHandle);
        });
    });

    describe('get output json', () => {
        it('should adapt the json to the expected output structure', () => {
            const includedLayerName = 'included-layer-name';
            const includedBlockName = 'included-block-name';
            const includedBlockHandle = 'included-block-handle';
            const includedInsertionHandle = 'included-insertion-handle';
            const includedNonBlockEntityHandle = 'included-non-block-entity-handle';

            const layerSelections = [
                getSelectionLayer({
                    name: includedLayerName,
                    isSelected: true
                }),
                getSelectionLayer({
                    isSelected: false,
                    entities: [
                        getEntity({
                            handle: includedNonBlockEntityHandle
                        })
                    ]
                })
            ];

            const blockSelections = [
                getSelectionBlock({
                    handle: includedBlockHandle,
                    name: includedBlockName,
                    isSelected: true,
                    layerName: includedLayerName
                })
            ];

            const nonBlockEntitiesSelections = getNonBlockEntities({
                isSelected: true
            });

            const dxfMock = getDXFDataModel({
                blocks: [
                    getBlock({
                        entities: [
                            getEntity()
                        ],
                        handle: includedBlockHandle,
                        name: includedBlockName
                    }),
                    getBlock()
                ],
                entities: {
                    entities: [
                        getEntity({
                            handle: includedNonBlockEntityHandle
                        })
                    ],
                    insertions: [
                        getInsert({
                            blockName: includedBlockName,
                            handle: includedInsertionHandle
                        })
                    ]
                },
                tables: getTable({
                    LAYER: {
                        entries: [
                            getLayerEntry({
                                name: includedLayerName
                            })
                        ]
                    }
                })
            });

            const adaptedData = getOutputJSON(dxfMock, layerSelections, blockSelections, nonBlockEntitiesSelections);

            expect(adaptedData.layers.length).toEqual(1);
            expect(adaptedData.layers[0].name).toEqual(includedLayerName);
            expect(adaptedData.layers[0].plottingFlag).toEqual(undefined);

            expect(adaptedData.blocks.length).toEqual(1);
            expect(adaptedData.blocks[0].name).toEqual(includedBlockName);

            expect(adaptedData.blocks[0].entities[0].space).toEqual(undefined);

            expect(adaptedData.blocks[0].insertions[0].handle).toEqual(includedInsertionHandle);
            expect(adaptedData.blocks[0].insertions[0].type).toEqual(undefined);
            expect(adaptedData.blocks[0].insertions[0].blockName).toEqual(undefined);

            expect(adaptedData.nonBlockEntities.length).toEqual(1);
            expect(adaptedData.nonBlockEntities[0].handle).toEqual(includedNonBlockEntityHandle);
            expect(adaptedData.nonBlockEntities[0].space).toEqual(undefined);
        });

        it('should filter out non-block entities', () => {
            const excludedNonBlockEntityHandle = 'excluded-non-block-entity-handle';

            const nonBlockEntitiesSelections = getNonBlockEntities({
                isSelected: false
            });

            const dxfMock = getDXFDataModel({
                blocks: [],
                entities: {
                    entities: [
                        getEntity({
                            handle: excludedNonBlockEntityHandle
                        })
                    ],
                    insertions: []
                },
                tables: getTable()
            });

            const adaptedData = getOutputJSON(dxfMock, [], [], nonBlockEntitiesSelections);

            expect(adaptedData.nonBlockEntities.length).toEqual(0);
        });
    });
});

