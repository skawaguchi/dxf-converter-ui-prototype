import React from 'react';
import { shallow } from 'enzyme';

import { PageError } from './PageError';

import { dxf as content } from '../../content/en.json';

describe('PageError', () => {
    function renderComponent() {
        return shallow(<PageError/>);
    }

    it('should render a page error', () => {
        const component = renderComponent();
        const pageContent = component.find('p');

        expect(component.type()).toEqual('div');
        expect(component.prop('data-hook')).toEqual('page-error');
        expect(pageContent.text()).toEqual(content.dxfError);
    });
});

