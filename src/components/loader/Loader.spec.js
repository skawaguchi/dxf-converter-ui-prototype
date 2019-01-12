import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from './Loader';
import LoaderIcon from '../../images/infinity-loader.svg';

describe('Loader', () => {
    function renderComponent() {
        return shallow(<Loader/>);
    }

    it('should render an identifiable  component', () => {
        const component = renderComponent();

        expect(component.type()).toEqual('div');
        expect(component.prop('data-hook')).toEqual('loader');
    });

    it('should contain a loading animation', () => {
        const child = renderComponent().childAt(0);

        expect(child.type()).toEqual(LoaderIcon);
    });
});

