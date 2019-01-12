import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import ReactFileReader from 'react-file-reader';

import { DXFFileInput } from './DXFFileInput';

import { getMockReactClass } from '../../mockUtils';

import { dxf as content } from '../../content/en.json';

const sandbox = sinon.sandbox.create();

describe('DXFFileInput', () => {
    let ChildMock;
    let props;

    function renderComponent() {
        ChildMock = getMockReactClass();

        props = {
            changeHandler: sandbox.stub()
        };

        return shallow(
            <DXFFileInput {...props}>
                <ChildMock/>
            </DXFFileInput>
        );
    }

    afterEach(() => {
        sandbox.restore();

        props = null;
    });

    it('should have a containing element', () => {
        const component = renderComponent();

        expect(component.type()).toEqual('div');
    });

    it('should have a file input', () => {
        const input = renderComponent().find(ReactFileReader);

        expect(input.props().base64).toEqual(false);
        expect(input.props().fileTypes).toEqual(['dxf']);
        expect(input.props().multipleFiles).toEqual(false);
    });

    it('should have a button', () => {
        const button = renderComponent().find('button');

        expect(button.prop('data-hook')).toEqual('file-button');
        expect(button.text()).toEqual(content.dxfButton);
    });

    it('should have a file handler callback', () => {
        const input = renderComponent().find(ReactFileReader);

        input.props().handleFiles();

        sandbox.assert.calledWithExactly(props.changeHandler);
    });
});

