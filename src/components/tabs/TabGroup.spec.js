import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { TabGroup } from './TabGroup';

import { getTab } from '../../mockUtils';

const sandbox = sinon.sandbox.create();

describe('TabGroup', () => {
    function renderComponent(overrides) {
        const props = {
            clickHandler: sandbox.stub(),
            id: 'some-id',
            tabList: [
                getTab(sandbox),
                getTab(sandbox)
            ],
            ...overrides
        };

        return {
            component: shallow(
                <TabGroup {...props}/>
            ),
            props
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    it('should have a container', () => {
        const {
            component,
            props
        } = renderComponent();

        expect(component.type()).toEqual('div');
        expect(component.prop('data-hook')).toEqual(props.id);
    });

    it('should have a list of tabs', () => {
        const {
            component,
            props
        } = renderComponent();

        expect(component.children().length).toEqual(props.tabList.length);

        const child = component.childAt(0);

        expect(child.prop('id')).toEqual(props.tabList[0].id);
        expect(child.prop('isSelected')).toEqual(true);
        expect(child.prop('label')).toEqual(props.tabList[0].label);
        expect(child.prop('value')).toEqual(props.tabList[0].value);
    });

    it('should select the first tab by default', () => {
        const {
            component,
            props
        } = renderComponent();

        expect(component.children().length).toEqual(props.tabList.length);

        const firstChild = component.childAt(0);
        const secondChild = component.childAt(1);

        expect(firstChild.prop('isSelected')).toEqual(true);
        expect(secondChild.prop('isSelected')).toEqual(false);
    });

    describe('when a tab is clicked', () => {
        it('should select the tab', () => {
            const {
                component
            } = renderComponent();

            let firstChild = component.childAt(0);
            let secondChild = component.childAt(1);
            const event = {};

            expect(firstChild.prop('isSelected')).toEqual(true);
            expect(secondChild.prop('isSelected')).toEqual(false);

            secondChild.props().clickHandler(event, secondChild.props().id);

            component.update();

            firstChild = component.childAt(0);
            secondChild = component.childAt(1);

            expect(firstChild.prop('isSelected')).toEqual(false);
            expect(secondChild.prop('isSelected')).toEqual(true);
        });

        it('should call the click handler callback', () => {
            const {
                component,
                props
            } = renderComponent();

            const secondChild = component.childAt(1);
            const event = {};

            const {
                clickHandler,
                id,
                value
            } = secondChild.props();

            clickHandler(event, id, value);

            sandbox.assert.calledWithExactly(props.clickHandler, event, id, value);
        });
    });
});

