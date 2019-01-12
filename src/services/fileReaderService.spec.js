import sinon from 'sinon';

import { getFileChangeHandler } from './fileReaderService';

import * as dxfConverter from '../dxf-converter/process';

import { pageErrorTypes } from '../constants/pageErrors';

const sandbox = sinon.sandbox.create();

describe('File Reader Service', () => {
    function getStubs(overrides) {
        const uiStoreMock = {
            blocks: null,
            rawFileText: 'some text',
            setDxf: sandbox.stub(),
            setPageError: sandbox.stub(),
            setRawFileText: sandbox.stub(),
            ...overrides
        };
        const dxfConverterStub = sandbox.stub(dxfConverter, 'processFile');

        const fileReaderStubs = {
            onload: sandbox.stub(),
            readAsText: sandbox.stub()
        };

        const fileReaderStub = sandbox.stub(window, 'FileReader');
        fileReaderStub.returns(fileReaderStubs);

        const convertedJSONMock = {
            blocks: [],
            tables: {}
        };
        dxfConverterStub.returns(convertedJSONMock);

        const fileMock = new File([], 'somefile.dxf');

        const fileDataMock = [
            fileMock
        ];

        const fileReaderResponseMock = 'some response';
        const onloadResponseMock = {
            target: {
                result: fileReaderResponseMock
            }
        };

        return {
            convertedJSONMock,
            dxfConverterStub,
            fileDataMock,
            fileMock,
            fileReaderResponseMock,
            fileReaderStubs,
            onloadResponseMock,
            uiStoreMock
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    describe('Given the file change handler', () => {
        describe('when the returned file is valid', () => {
            it('should set the raw data in the store', () => {
                const {
                    fileDataMock,
                    fileReaderResponseMock,
                    fileReaderStubs,
                    onloadResponseMock,
                    uiStoreMock
                } = getStubs();

                const changeHandler = getFileChangeHandler(uiStoreMock);

                changeHandler(fileDataMock);

                fileReaderStubs.onload(onloadResponseMock);

                sandbox.assert.calledWithExactly(uiStoreMock.setRawFileText, fileReaderResponseMock);
            });

            it('should update the store', () => {
                const {
                    convertedJSONMock,
                    fileDataMock,
                    fileMock,
                    fileReaderStubs,
                    onloadResponseMock,
                    uiStoreMock
                } = getStubs();

                const changeHandler = getFileChangeHandler(uiStoreMock);

                changeHandler(fileDataMock);

                fileReaderStubs.onload(onloadResponseMock);

                sandbox.assert.calledWithExactly(
                    uiStoreMock.setDxf,
                    fileMock,
                    convertedJSONMock
                );
            });

            it('should reset the in-page error', () => {
                const {
                    fileDataMock,
                    fileReaderStubs,
                    onloadResponseMock,
                    uiStoreMock
                } = getStubs();

                const changeHandler = getFileChangeHandler(uiStoreMock);

                changeHandler(fileDataMock);

                fileReaderStubs.onload(onloadResponseMock);

                sandbox.assert.calledWithExactly(uiStoreMock.setPageError, null);
            });
        });

        describe('when the returned file is invalid', () => {
            function assertMissingDXFAttribute(invalidJSONMock) {
                it('should set the page error', () => {
                    const {
                        dxfConverterStub,
                        fileDataMock,
                        fileReaderStubs,
                        onloadResponseMock,
                        uiStoreMock
                    } = getStubs();

                    dxfConverterStub.returns(invalidJSONMock);

                    const changeHandler = getFileChangeHandler(uiStoreMock);

                    changeHandler(fileDataMock);

                    fileReaderStubs.onload(onloadResponseMock);

                    sandbox.assert.calledWithExactly(uiStoreMock.setPageError, pageErrorTypes.DXF_READ_ERROR);
                });
            }

            describe('and it is missing blocks', () => {
                const invalidJSONMock = {
                    tables: {}
                };

                assertMissingDXFAttribute(invalidJSONMock);
            });

            describe('and it is missing tables', () => {
                const invalidJSONMock = {
                    blocks: []
                };

                assertMissingDXFAttribute(invalidJSONMock);
            });
        });
    });
});

