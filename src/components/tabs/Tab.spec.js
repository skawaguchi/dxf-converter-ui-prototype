import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Tab } from './Tab';

import { getTab } from '../../mockUtils';

const sandbox = sinon.sandbox.create();

describe('Tab', () => {
    function renderComponent(overrides) {
        const props = getTab(sandbox, overrides);

        return {
            component: shallow(
                <Tab {...props}/>
            ),
            props
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    it('should be an identifiable button', () => {
        const {
            component,
            props
        } = renderComponent();

        expect(component.type()).toEqual('button');
        expect(component.prop('id')).toEqual(props.id);
        expect(component.text()).toEqual(props.label);
    });

    describe('when the button is clicked', () => {
        it('should call the handler', () => {
            const {
                component,
                props
            } = renderComponent();

            const eventMock = {
                target: {
                    value: 'some value'
                }
            };

            component.simulate('click', eventMock);

            sandbox.assert.calledWithExactly(
                props.clickHandler,
                eventMock,
                props.id,
                props.value
            );
        });
    });

    describe('Given the button is selected', () => {
        it('should appear as selected', () => {
            const {
                component
            } = renderComponent({
                isSelected: true
            });

            expect(component.length).toEqual(1);
        });
    });

    describe('Given the button is not selected', () => {
        it('should appear as unselected', () => {
            const {
                component
            } = renderComponent({
                isSelected: false
            });

            expect(component.length).toEqual(1);
        });
    });
});

