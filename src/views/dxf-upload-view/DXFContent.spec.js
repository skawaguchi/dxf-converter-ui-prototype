import React from 'react';
import { shallow } from 'enzyme';

import Waypoint from 'react-waypoint';

import { DXFContent } from './DXFContent';

import { DXFSource } from './DXFSource';
import { DXFEditor } from './DXFEditor';

describe('<DXFContent/>', () => {
    function renderComponent() {
        return shallow(
            <DXFContent/>
        );
    }

    describe('Given the component renders', () => {
        it('should have an identifiable container element', () => {
            const container = renderComponent().find('section');

            expect(container.prop('data-hook')).toEqual('dxf-content');
        });

        it('should have a dxf editor', () => {
            const editor = renderComponent().find(DXFEditor);

            expect(editor.length).toEqual(1);
        });

        it('should have dxf source that is not docked by default', () => {
            const source = renderComponent().find(DXFSource);

            expect(source.length).toEqual(1);
            expect(source.props().isDocked).toEqual(false);
        });

        describe('when the top of the container is scrolled above the viewport', () => {
            it('should have dxf source that is not docked by default', () => {
                const component = renderComponent();
                const waypoint = component.find(Waypoint);

                waypoint.props().onPositionChange({
                    currentPosition: 'above'
                });
                component.update();

                const source = component.find(DXFSource);

                expect(source.props().isDocked).toEqual(true);
            });
        });

        describe('when the top of the container is scrolled below the viewport fater being above', () => {
            it('should have dxf source that is not docked by default', () => {
                const component = renderComponent();
                const waypoint = component.find(Waypoint);

                waypoint.props().onPositionChange({
                    currentPosition: 'above'
                });
                waypoint.props().onPositionChange({
                    currentPosition: 'below'
                });
                component.update();

                const source = component.find(DXFSource);

                expect(source.props().isDocked).toEqual(false);
            });
        });
    });
});

