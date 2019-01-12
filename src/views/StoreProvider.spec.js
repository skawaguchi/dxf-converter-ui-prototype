import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'mobx-react';

import { StoreProvider } from './StoreProvider';

import { UIStore } from '../stores/UIStore';
import { getMockReactClass } from '../mockUtils';

describe('<StoreProvider/>', () => {
    let ChildMock;

    function renderComponent() {
        ChildMock = getMockReactClass();

        return shallow(
            <StoreProvider>
                <ChildMock/>
            </StoreProvider>
        );
    }

    it('should connect the ui store', () => {
        const component = renderComponent();

        const provider = component.find(Provider);

        expect(provider).toHaveLength(1);

        expect(provider.props().store.ui instanceof UIStore).toEqual(true);
    });

    it('should pass children through', () => {
        const component = renderComponent();

        const provider = component.find(Provider);

        expect(provider.childAt(0).type()).toEqual(ChildMock);
    });
});

