import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { DXFUploadView } from './DXFUploadView';

import { DXFFileInput } from '../components/dxf/DXFFileInput';
import { DXFContent } from './dxf-upload-view/DXFContent';
import { PageError } from '../components/page-error/PageError';

import * as fileReaderMethods from '../services/fileReaderService';
import { pageErrorTypes } from '../constants/pageErrors';

import { getDXFDataModel } from '../mockUtils';

const sandbox = sinon.sandbox.create();

describe('<DXFUploadView/>', () => {
    function renderComponent(overrides) {
        const changeHandlerStub = sandbox.stub(fileReaderMethods, 'getFileChangeHandler');

        const fileReaderStub = sandbox.stub();
        changeHandlerStub.returns(fileReaderStub);

        const toggleBlockSelection = sandbox.stub();

        const props = {
            handleDXFFileSave: sandbox.stub()
        };

        const saveDXFStub = sandbox.stub();

        const storeMock = {
            ui: {
                dxf: getDXFDataModel(),
                pageError: null,
                setSaveDXFFileCallback: saveDXFStub,
                ...overrides
            }
        };

        const component = shallow(
            <DXFUploadView
                { ...props }
                store={ storeMock }
            />
        ).dive();

        return {
            changeHandlerStub,
            component,
            fileReaderStub,
            props,
            saveDXFStub,
            storeMock,
            toggleBlockSelection
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    describe('Given the component renders', () => {
        it('should have a container element', () => {
            const {
                component
            } = renderComponent();

            expect(component.type()).toEqual('section');
            expect(component.prop('data-hook')).toEqual('dxf-upload-view');
        });

        it('should have a file reader', () => {
            const reader = renderComponent()
                .component
                .find(DXFFileInput);

            expect(reader.length).toEqual(1);
        });

        it('should set the save dxf callback', () => {
            const {
                props,
                saveDXFStub
            } = renderComponent();

            sandbox.assert.calledWithExactly(saveDXFStub, props.handleDXFFileSave);
        });

        describe('and there is no dxf data', () => {
            it('should not show the dxf content', () => {
                const overrides = {
                    dxf: null
                };
                const { component } = renderComponent(overrides);
                const content = component.find(DXFContent);

                expect(content.length).toEqual(0);
            });
        });

        describe('and there is dxf data', () => {
            it('should show the dxf content', () => {
                const { component } = renderComponent();
                const content = component.find(DXFContent);

                expect(content.length).toEqual(1);
            });
        });

        describe('and there is an error reading the dxf file', () => {
            it('should show the page error and hide the checkboxes', () => {
                const overrides = {
                    pageError: pageErrorTypes.DXF_READ_ERROR
                };
                const { component } = renderComponent(overrides);
                const pageError = component.find(PageError);

                expect(pageError.length).toEqual(1);
            });
        });

        describe('when the file input is changed', () => {
            it('should call the change handler', () => {
                const {
                    changeHandlerStub,
                    component,
                    fileReaderStub,
                    storeMock
                } = renderComponent();

                const fileInput = component.find(DXFFileInput);
                const eventMock = {};

                fileInput.props().changeHandler(eventMock);

                sandbox.assert.calledWithExactly(changeHandlerStub, storeMock.ui);
                sandbox.assert.calledWithExactly(fileReaderStub, eventMock);
            });
        });
    });
});

