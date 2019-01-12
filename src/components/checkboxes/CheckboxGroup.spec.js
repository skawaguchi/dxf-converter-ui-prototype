import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Chance from 'chance';

import { CheckboxGroup } from './CheckboxGroup';

import { Checkbox } from './Checkbox';

const sandbox = sinon.sandbox.create();
const chance = new Chance();

describe('CheckboxGroup', () => {
    let props;

    function mockCheckbox() {
        return {
            id: chance.hash(),
            isSelected: chance.bool(),
            label: chance.word(),
            value: chance.word()
        };
    }

    function renderComponent() {
        props = {
            changeHandler: sandbox.stub(),
            checkboxes: [
                mockCheckbox()
            ],
            className: 'some-class',
            mouseOutHandler: sandbox.stub(),
            mouseOverHandler: sandbox.stub()
        };

        return shallow(
            <CheckboxGroup {...props}/>
        );
    }

    afterEach(() => {
        sandbox.restore();
    });

    it('should have an identifiable container', () => {
        const component = renderComponent();

        expect(component.prop('data-hook')).toContain('checkbox-group');
    });

    it('should allow a custom class name', () => {
        const component = renderComponent();

        expect(component.prop('data-hook')).toContain('some-class');
    });

    it('should have checkboxes', () => {
        const checkboxes = renderComponent().find(Checkbox);

        expect(checkboxes.length).toEqual(props.checkboxes.length);
    });

    describe('when checkboxes are passed down', () => {
        it('should update the checkboxes', () => {
            const component = renderComponent();
            const newCheckboxes = [
                mockCheckbox(),
                mockCheckbox()
            ];

            component.setProps({
                checkboxes: newCheckboxes
            });

            expect(component.find(Checkbox).length).toEqual(newCheckboxes.length);
        });
    });

    describe('when a checkbox is changed', () => {
        it('should toggle the checkbox', () => {
            const component = renderComponent();
            let checkbox = component.find(Checkbox);

            const originalIsChecked = checkbox.props().isSelected;

            const eventMock = {};
            const idMock = props.checkboxes[0].id;

            checkbox.props().changeHandler(eventMock, idMock);

            component.update();

            checkbox = component.find(Checkbox);

            expect(checkbox.props().isSelected).not.toEqual(originalIsChecked);
        });

        it('should call the change callback', () => {
            const checkbox = renderComponent().find(Checkbox);
            const eventMock = {};
            const idMock = 'some id';
            const valueMock = 'some value';

            checkbox.props().changeHandler(eventMock, idMock, valueMock);

            sandbox.assert.calledWithExactly(props.changeHandler, eventMock, idMock, valueMock);
        });
    });

    describe('when a checkbox is moused over', () => {
        it('should call the mouse over callback', () => {
            const checkbox = renderComponent().find(Checkbox);
            const eventMock = {};
            const idMock = 'some id';
            const valueMock = 'some value';

            checkbox.props().mouseOverHandler(eventMock, idMock, valueMock);

            sandbox.assert.calledWithExactly(props.mouseOverHandler, eventMock, idMock, valueMock);
        });
    });

    describe('when a checkbox is moused out', () => {
        it('should call the mouse out callback', () => {
            const checkbox = renderComponent().find(Checkbox);
            const eventMock = {};
            const idMock = 'some id';
            const valueMock = 'some value';

            checkbox.props().mouseOutHandler(eventMock, idMock, valueMock);

            sandbox.assert.calledWithExactly(props.mouseOutHandler, eventMock, idMock, valueMock);
        });
    });
});

