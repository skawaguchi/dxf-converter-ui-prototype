import React from 'react';
import { shallow } from 'enzyme';
import { RawTextDisplay } from './RawTextDisplay';

describe('RawTextDisplay', () => {
    function renderComponent() {
        const props = {
            text: ''
        };

        return {
            component: shallow(<RawTextDisplay {...props}/>),
            props
        };
    }

    it('should render an identifiable containing component', () => {
        const { component } = renderComponent();

        expect(component.type()).toEqual('div');
        expect(component.prop('data-hook')).toEqual('raw-text-display');
    });

    it('should not show the raw text by default', () => {
        const rawTextInput = renderComponent().component.find('textarea');

        expect(rawTextInput.length).toEqual(0);
    });

    it('should have a button to toggle the raw text', () => {
        const button = renderComponent().component.find('button');

        expect(button.length).toEqual(1);
    });

    describe('when the raw text is displayed', () => {
        it('should display the raw text', () => {
            const {
                component,
                props
            } = renderComponent();
            const button = component.find('button');

            button.simulate('click');

            const rawTextInput = component.find('textarea');

            expect(rawTextInput.props().readOnly).toEqual(true);
            expect(rawTextInput.props().value).toEqual(props.text);
        });
    });
});

