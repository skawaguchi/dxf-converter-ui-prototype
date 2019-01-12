import React from 'react';
import { shallow } from 'enzyme';

import { App } from './App';

import { StoreProvider } from './StoreProvider';
import { DXFUploadView } from './DXFUploadView';

describe('<App/>', () => {
    function renderComponent() {
        return shallow(
            <App/>
        );
    }

    describe('Given the component renders', () => {
        it('should provide the application store', () => {
            const component = renderComponent();

            expect(component.type()).toEqual(StoreProvider);
        });

        it('should have an identifiable container element', () => {
            const container = renderComponent().find('main');

            expect(container.prop('data-hook')).toEqual('dxf-converter');
        });

        it('should have a dxf upload view with a no-op for the file save callback', () => {
            const view = renderComponent().find(DXFUploadView);

            view.props().handleDXFFileSave();

            expect(view.length).toEqual(1);
        });
    });
});

