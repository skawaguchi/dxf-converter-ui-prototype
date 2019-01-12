import React, { Component } from 'react';
import Chance from 'chance';

import { userRoles } from './constants/userRoles';

import { DXFData } from './models/DXFData';
import { DXFFile } from './models/DXFFile';
import { DXFOutput } from './models/output/DXFOutput';

const chance = new Chance();

class MockReactClass extends Component {
    render() {
        return (
            <div className='mock'/>
        );
    }
}

export const getMockReactClass = () => MockReactClass;

export const getRawDXFFile = (overrides) => {
    return {
        lastModified: chance.natural(),
        lastModifiedDate: chance.date(),
        name: chance.file({
            extension: 'dxf'
        }),
        size: chance.natural(),
        ...overrides
    };
};

export const getDXFFile = (overrides) => {
    const dxfFile = getRawDXFFile(overrides);

    return {
        ...dxfFile,
        title: dxfFile.name,
        ...overrides
    };
};

export const getDXFFileModel = (overrides) => DXFFile(getDXFFile(overrides));

export const getDXFData = (overrides) => ({
    blocks: [],
    entities: {
        entities: [],
        insertions: []
    },
    tables: {
        LAYER: {
            entries: []
        }
    },
    ...overrides
});

export const getDXFDataModel = (overrides) => DXFData(getDXFData(overrides));

export const getUser = (overrides) => ({
    displayName: chance.name(),
    email: chance.email(),
    id: chance.hash(),
    ...overrides
});

export const getUserRole = (overrides) => ({
    role: chance.pickone(userRoles.meta.map),
    userID: chance.hash(),
    ...overrides
});


export const getLayerEntry = (overrides) => ({
    colorNumber: chance.natural({
        max: 255,
        min: 0
    }),
    lineType: chance.pickone([
        'Continuous'
    ]),
    name: chance.string(),
    plottingFlag: chance.bool(),
    ...overrides
});

export const getSelectionLayer = (overrides) => ({
    ...getLayerEntry(overrides),
    isSelected: chance.bool(),
    ...overrides
});

export const getTable = (overrides) => ({
    APPID: {
        entries: [],
        name: 'APPID'
    },
    BLOCK_RECORD: {
        entries: [],
        name: 'BLOCK_RECORD'
    },
    DIMSTYLE: {
        entries: [],
        name: 'DIMSTYLE'
    },
    LAYER: {
        entries: [
            getLayerEntry()
        ],
        name: 'LAYER'
    },
    LTYPE: {
        entries: [],
        name: 'LTYPE'
    },
    STYLE: {
        entries: [],
        name: 'STYLE'
    },
    UCS: {
        entries: [],
        name: 'UCS'
    },
    VIEW: {
        entries: [],
        name: 'VIEW'
    },
    VPORT: {
        entries: [],
        name: 'VPORT'
    },
    ...overrides
});

export const getCheckbox = (overrides) => ({
    id: chance.hash(),
    isSelected: chance.bool(),
    label: chance.string(),
    value: chance.string(),
    ...overrides
});

const getColorNumber = () => chance.natural({
    max: 255,
    min: 0
});

const getSpace = () => chance.pickone([
    'MODEL',
    'PAPER'
]);

export const getArcAttributes = (overrides) => ({
    colorNumber: getColorNumber(),
    cx: chance.integer(),
    cy: chance.integer(),
    cz: chance.integer(),
    endAngle: chance.integer(),
    layerName: chance.word(),
    radius: chance.integer(),
    space: getSpace(),
    startAngle: chance.integer(),
    strokeWidth: chance.natural(),
    ...overrides
});

export const getCircleAttributes = (overrides) => ({
    colorNumber: getColorNumber(),
    cx: chance.integer(),
    cy: chance.integer(),
    cz: chance.integer(),
    layerName: chance.word(),
    r: chance.integer(),
    space: getSpace(),
    strokeWidth: chance.natural(),
    ...overrides
});

export const getLineAttributes = (overrides) => ({
    colorNumber: getColorNumber(),
    layerName: chance.word(),
    r: chance.integer(),
    space: getSpace(),
    strokeWidth: chance.natural(),
    x1: chance.integer(),
    x2: chance.integer(),
    y1: chance.integer(),
    y2: chance.integer(),
    z1: chance.integer(),
    z2: chance.integer(),
    ...overrides
});

export const getVertices = (overrides) => ({
    x: chance.integer(),
    y: chance.integer(),
    ...overrides
});

export const getLWPolyLineAttributes = (overrides) => ({
    closed: chance.bool(),
    colorNumber: getColorNumber(),
    layerName: chance.word(),
    numberOfVertices: chance.natural(),
    space: getSpace(),
    strokeWidth: chance.natural(),
    vertices: getVertices(),
    x: chance.integer(),
    y: chance.integer(),
    z: chance.integer(),
    ...overrides
});

export const getRandomAttributes = (overrides) => {
    return chance.pickone([
        getArcAttributes(overrides),
        getCircleAttributes(overrides),
        getLineAttributes(overrides),
        getLWPolyLineAttributes(overrides)
    ]);
};

export const getEntity = (overrides) => ({
    attributes: getRandomAttributes(),
    handle: chance.hash(),
    space: chance.pickone([
        'MODEL',
        'PAPER'
    ]),
    type: chance.pickone([
        'ARC',
        'CIRCLE',
        'LINE',
        'LWPOLYLINE'
    ]),
    ...overrides
});

export const getBlock = (overrides) => ({
    handle: chance.hash(),
    entities: [
        getEntity()
    ],
    layerName: chance.word(),
    name: chance.word(),
    x: chance.natural(),
    y: chance.natural(),
    z: chance.natural(),
    ...overrides
});

export const getSelectionBlock = (overrides) => ({
    ...getBlock(overrides),
    isSelected: chance.bool(),
    ...overrides
});

export const getInsert = (overrides) => ({
    blockName: chance.word(),
    handle: chance.hash(),
    x: chance.integer(),
    y: chance.integer(),
    z: chance.integer(),
    xScale: chance.integer(),
    yScale: chance.integer(),
    zScale: chance.integer(),
    ...overrides
});

export const getDXFOutput = (overrides) => ({
    blocks: [
        getBlock()
    ],
    entities: {
        entities: [
            getEntity({
                attributes: getArcAttributes()
            }),
            getEntity({
                attributes: getCircleAttributes()
            }),
            getEntity({
                attributes: getLineAttributes()
            }),
            getEntity({
                attributes: getLWPolyLineAttributes()
            })
        ],
        insertions: [
            getInsert()
        ]
    },
    tables: getTable(),
    ...overrides
});

export const getDXFOutputModel = (overrides) => DXFOutput(getDXFOutput(overrides));

export const getTab = (sandbox, overrides) => ({
    clickHandler: sandbox.stub(),
    id: chance.word(),
    isSelected: chance.bool(),
    label: chance.string(),
    value: chance.string(),
    ...overrides
});

export const getNonBlockEntities = (overrides) => ({
    isSelected: chance.bool(),
    entities: [
        getEntity()
    ],
    ...overrides
});
