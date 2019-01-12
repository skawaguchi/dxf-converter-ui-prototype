import sinon from 'sinon';

import FileSaver from 'file-saver';

import { downloadDXFJSON } from './downloadDXFJSONService';

const sandbox = sinon.sandbox.create();

jest.mock('file-saver', () => ({
    saveAs: jest.fn()
}));

describe('download dxf json service', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should create a write stream of the code passed to it', () => {
        const fileMock = {};
        window.File = jest.fn(() => fileMock);

        const stringifiedJSONMock = 'some json';
        const jsonStringifyStub = sandbox.stub(JSON, 'stringify');
        jsonStringifyStub.returns(stringifiedJSONMock);

        const fileName = 'filename.json';
        const jsonMock = {
            some: 'fake json'
        };

        downloadDXFJSON(fileName, jsonMock);

        sandbox.assert.calledWithExactly(jsonStringifyStub, jsonMock, null, 4);

        expect(window.File).toHaveBeenLastCalledWith(
            [
                stringifiedJSONMock
            ],
            fileName, {
                type: 'application/json;charset=utf-8'
            });

        expect(FileSaver.saveAs).toHaveBeenCalledWith(fileMock);
    });
});
