import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Chance from 'chance';

import { DXFJSONViewer } from './DXFJSONViewer';

import * as dxfJSONAdapter from '../../adapters/dxfAdapter';

import {
    getDXFDataModel,
    getNonBlockEntities,
    getSelectionBlock,
    getSelectionLayer
} from '../../mockUtils';

const sandbox = sinon.sandbox.create();
const chance = new Chance();

describe('<DXFJSONViewer/>', () => {
    const jsonMethodMap = {
        OUTPUT_JSON: 'getOutputJSON',
        SOURCE_JSON: 'getSourceJSON'
    };

    function renderComponent(type, overrides) {
        const props = {
            type
        };
        const storeMock = {
            ui: {
                dxf: getDXFDataModel(),
                blocks: [
                    getSelectionBlock()
                ],
                layers: [
                    getSelectionLayer()
                ],
                nonBlockEntities: getNonBlockEntities(),
                ...overrides
            }
        };

        const adaptedJSON = getDXFDataModel();

        const jsonAdapterStub = sandbox.stub(dxfJSONAdapter, jsonMethodMap[type]);
        jsonAdapterStub.returns(adaptedJSON);

        const stringifiedJSON = 'some json';
        const jsonStringifyStub = sandbox.stub(global.JSON, 'stringify');
        jsonStringifyStub.returns(stringifiedJSON);

        const component = shallow(
            <DXFJSONViewer store={storeMock} {...props}/>
        ).dive();

        return {
            adaptedJSON,
            component,
            jsonAdapterStub,
            jsonStringifyStub,
            storeMock,
            stringifiedJSON
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    describe('Given the component renders', () => {
        it('should have an identifiable container element', () => {
            const anyJSON = chance.pickone(['SOURCE_JSON', 'OUTPUT_JSON']);
            const container = renderComponent(anyJSON).component.find('pre');

            expect(container.prop('data-hook')).toEqual('dxf-json-viewer');
        });

        function assertJSONType(type, typeCode) {
            describe(`and the ${type} json is requested`, () => {
                it(`should adapt the json to display the ${type} json`, () => {
                    const {
                        jsonAdapterStub,
                        storeMock
                    } = renderComponent(typeCode);
                    const {
                        dxf,
                        blocks,
                        layers,
                        nonBlockEntities
                    } = storeMock.ui;

                    sandbox.assert.calledWithExactly(
                        jsonAdapterStub,
                        dxf,
                        layers,
                        blocks,
                        nonBlockEntities
                    );
                });

                it(`should display the ${type} dxf json`, () => {
                    const {
                        adaptedJSON,
                        component,
                        jsonStringifyStub,
                        stringifiedJSON
                    } = renderComponent('SOURCE_JSON');

                    sandbox.assert.calledWithExactly(jsonStringifyStub, adaptedJSON, null, 2);

                    expect(component.text()).toEqual(stringifiedJSON);
                });
            });
        }

        assertJSONType('source', 'SOURCE_JSON');
        assertJSONType('output', 'OUTPUT_JSON');
    });
});
