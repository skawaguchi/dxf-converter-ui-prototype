import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Chance from 'chance';

import styles from './Checkbox.css';

import { Checkbox } from './Checkbox';

const sandbox = sinon.sandbox.create();

const chance = new Chance();

describe('Checkbox', () => {
    let props;

    function renderComponent(overrides) {
        props = {
            changeHandler: sandbox.stub(),
            className: 'some-class',
            id: 'some id',
            isDisabled: chance.bool(),
            isIndeterminate: false,
            isSelected: chance.bool(),
            label: 'some label',
            mouseOutHandler: sandbox.stub(),
            mouseOverHandler: sandbox.stub(),
            title: 'some title',
            value: 'some value',
            ...overrides
        };

        return shallow(
            <Checkbox {...props}/>
        );
    }

    afterEach(() => {
        sandbox.restore();
    });

    it('should have an identifiable container', () => {
        const component = renderComponent();

        expect(component.prop('data-hook')).toContain('checkbox');
    });

    it('should set a default data hook name', () => {
        const component = renderComponent({
            className: null
        });

        expect(component.prop('data-hook')).toContain('checkbox');
    });

    it('should allow a custom data hook name', () => {
        const component = renderComponent();

        expect(component.prop('data-hook')).toContain('some-class');
    });

    it('should have a checkbox', () => {
        const checkbox = renderComponent().find('input');

        expect(checkbox.props().id).toEqual(props.id);
        expect(checkbox.props().name).toEqual(props.id);
        expect(checkbox.props().type).toEqual('checkbox');
        expect(checkbox.props().value).toEqual(props.value);
        expect(checkbox.props().checked).toEqual(props.isSelected);
        expect(checkbox.props().disabled).toEqual(props.isDisabled);
    });

    it('should have a change handler callback for the checkbox', () => {
        const checkbox = renderComponent().find('input');
        const eventMock = {};

        checkbox.props().onChange(eventMock);

        sandbox.assert.calledWithExactly(props.changeHandler, eventMock, props.id, props.value);
    });

    it('should have a mouse over handler callback for the checkbox', () => {
        const checkboxContainer = renderComponent();
        const eventMock = {};

        checkboxContainer.props().onMouseOver(eventMock);

        sandbox.assert.calledWithExactly(props.mouseOverHandler, eventMock, props.id, props.value);
    });

    it('should have a mouse out handler callback for the checkbox', () => {
        const checkboxContainer = renderComponent();
        const eventMock = {};

        checkboxContainer.props().onMouseOut(eventMock);

        sandbox.assert.calledWithExactly(props.mouseOutHandler, eventMock, props.id, props.value);
    });

    it('should have a label for the checkbox', () => {
        const label = renderComponent().find('label');

        expect(label.text()).toEqual(props.label);
        expect(label.props().htmlFor).toEqual(props.id);
        expect(label.props().title).toEqual(props.title);
    });

    it('should have a class when indeterminate', () => {
        const component = renderComponent({
            isIndeterminate: true
        });

        expect(component.props().className).toEqual(styles.indeterminateContainer);
    });
});

