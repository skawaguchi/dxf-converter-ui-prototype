import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { DXFTitleInput } from './DXFTitleInput';

import { getDXFFileModel } from '../../mockUtils';

const sandbox = sinon.sandbox.create();

describe('<DXFTitleInput/>', () => {
    function renderComponent(overrides) {
        const storeMock = {
            ui: {
                file: getDXFFileModel(),
                setDXFTitle: sandbox.stub(),
                ...overrides
            }
        };

        const component = shallow(
            <DXFTitleInput store={ storeMock } />
        ).dive();

        return {
            component,
            storeMock
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    describe('Given the component renders', () => {
        it('should have a containing element', () => {
            const {
                component
            } = renderComponent();

            expect(component.type()).toEqual('div');
            expect(component.prop('data-hook')).toEqual('dxf-title-input');
        });

        it('should have a label with some text', () => {
            const {
                component
            } = renderComponent();

            const label = component.find('label');

            expect(label.type()).toEqual('label');
            expect(label.prop('htmlFor')).toEqual('dxf-title-text-input');
            expect(label.text().length).toBeGreaterThan(0);
        });

        it('should have a text input', () => {
            const {
                component,
                storeMock
            } = renderComponent();

            const input = component.find('input');

            expect(input.type()).toEqual('input');
            expect(input.prop('id')).toEqual('dxf-title-text-input');
            expect(input.prop('placeholder').length).toBeGreaterThan(0);
            expect(input.prop('type')).toEqual('text');
            expect(input.prop('value')).toEqual(storeMock.ui.file.title);
        });
    });

    describe('When the title is changed', () => {
        it('should change the title text', () => {
            const {
                component,
                storeMock
            } = renderComponent();

            const input = component.find('input');
            const valueMock = 'some changed value';
            const changeEvent = {
                target: {
                    value: valueMock
                }
            };

            input.simulate('change', changeEvent);

            sandbox.assert.calledWithExactly(storeMock.ui.setDXFTitle, valueMock);
        });
    });
});

