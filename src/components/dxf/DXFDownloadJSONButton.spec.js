import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { DXFDownloadJSONButton } from './DXFDownloadJSONButton';

import {
    getDXFDataModel,
    getDXFFileModel,
    getNonBlockEntities,
    getSelectionBlock,
    getSelectionLayer
} from '../../mockUtils';

import * as dxfJSONAdapter from '../../adapters/dxfAdapter';
import * as downloadDXFJSONService from '../../services/downloadDXFJSONService';

const sandbox = sinon.sandbox.create();

describe('DXFDownloadJSONButton', () => {
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
                ...overrides
            }
        };

        const adaptedJSON = getDXFDataModel();

        const jsonAdapterStub = sandbox.stub(dxfJSONAdapter, 'getOutputJSON');
        jsonAdapterStub.returns(adaptedJSON);

        const downloadJSONStub = sandbox.stub(downloadDXFJSONService, 'downloadDXFJSON');

        return {
            adaptedJSON,
            component: shallow(
                <DXFDownloadJSONButton store={storeMock}/>
            ).dive(),
            downloadJSONStub,
            jsonAdapterStub,
            storeMock
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    it('should be an identifiable button', () => {
        const { component } = renderComponent();

        expect(component.type()).toEqual('button');
        expect(component.prop('data-hook')).toEqual('download-json-button');
        expect(component.text().length).toBeGreaterThan(0);
    });

    describe('when the button is clicked', () => {
        it('should adapt the json to download', () => {
            const {
                component,
                jsonAdapterStub,
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
                jsonAdapterStub,
                dxf,
                layers,
                blocks,
                nonBlockEntities
            );
        });

        it('should save the json', () => {
            const {
                adaptedJSON,
                component,
                downloadJSONStub,
                storeMock
            } = renderComponent();
            const {
                file
            } = storeMock.ui;

            component.simulate('click');

            sandbox.assert.calledWithExactly(
                downloadJSONStub,
                `${file.title}.json`,
                adaptedJSON
            );
        });
    });
});

