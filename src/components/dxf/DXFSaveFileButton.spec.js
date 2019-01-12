import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Chance from 'chance';

import { DXFSaveFileButton } from './DXFSaveFileButton';

import {
    getDXFDataModel,
    getDXFFileModel,
    getNonBlockEntities,
    getSelectionBlock,
    getSelectionLayer
} from '../../mockUtils';

import * as dxfJSONAdapter from '../../adapters/dxfAdapter';

const sandbox = sinon.sandbox.create();
const chance = new Chance();

describe('DXFSaveFileButton', () => {
    function renderComponent(overrides) {
        const storeMock = {
            ui: {
                dxf: getDXFDataModel(),
                blocks: [
                    getSelectionBlock()
                ],
                file: getDXFFileModel(),
                layers: [
                    getSelectionLayer()
                ],
                nonBlockEntities: getNonBlockEntities(),
                rawFileText: chance.string(),
                saveDXFFile: sandbox.stub(),
                ...overrides
            }
        };

        const adaptedOutputJSON = getDXFFileModel();
        const outputJSONAdapterStub = sandbox.stub(dxfJSONAdapter, 'getOutputJSON');
        outputJSONAdapterStub.returns(adaptedOutputJSON);

        const adaptedSourceJSON = getDXFFileModel();
        const sourceJSONAdapterStub = sandbox.stub(dxfJSONAdapter, 'getSourceJSON');
        sourceJSONAdapterStub.returns(adaptedSourceJSON);

        return {
            adaptedSourceJSON,
            adaptedOutputJSON,
            component: shallow(
                <DXFSaveFileButton store={storeMock}/>
            ).dive(),
            outputJSONAdapterStub,
            sourceJSONAdapterStub,
            storeMock
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    it('should be an identifiable button', () => {
        const { component } = renderComponent();

        expect(component.type()).toEqual('button');
        expect(component.prop('data-hook')).toEqual('save-file-button');
        expect(component.text().length).toBeGreaterThan(0);
    });

    describe('when the button is clicked', () => {
        it('should adapt the json for source and output', () => {
            const {
                component,
                outputJSONAdapterStub,
                sourceJSONAdapterStub,
                storeMock
            } = renderComponent();
            const {
                dxf,
                blocks,
                layers,
                nonBlockEntities
            } = storeMock.ui;

            component.simulate('click');

            sandbox.assert.calledWithExactly(
                sourceJSONAdapterStub,
                dxf,
                layers,
                blocks,
                nonBlockEntities
            );

            sandbox.assert.calledWithExactly(
                outputJSONAdapterStub,
                dxf,
                layers,
                blocks,
                nonBlockEntities
            );
        });

        it('should save the file and related data', () => {
            const {
                adaptedSourceJSON,
                adaptedOutputJSON,
                component,
                storeMock
            } = renderComponent();
            const {
                file,
                saveDXFFile
            } = storeMock.ui;

            component.simulate('click');

            sandbox.assert.calledWithExactly(
                saveDXFFile,
                file,
                adaptedSourceJSON,
                adaptedOutputJSON
            );
        });
    });
});

