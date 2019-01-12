import React from 'react';
import { shallow } from 'enzyme';

import { DXFEditor } from './DXFEditor';

import { DXFTitleInput } from '../../components/dxf/DXFTitleInput';
import { DXFSelections } from '../../components/dxf/DXFSelections';
import { DXFDownloadJSONButton } from '../../components/dxf/DXFDownloadJSONButton';
import { DXFSaveFileButton } from '../../components/dxf/DXFSaveFileButton';

describe('<DXFEditor/>', () => {
    function renderComponent() {
        return shallow(
            <DXFEditor/>
        );
    }

    describe('Given the component renders', () => {
        it('should have an identifiable container element', () => {
            const container = renderComponent().find('div');

            expect(container.prop('data-hook')).toEqual('dxf-editor');
        });

        it('should have a title input', () => {
            const input = renderComponent().find(DXFTitleInput);

            expect(input.length).toEqual(1);
        });

        it('should have a download json button', () => {
            const button = renderComponent().find(DXFDownloadJSONButton);

            expect(button.length).toEqual(1);
        });

        it('should have a save file button', () => {
            const button = renderComponent().find(DXFSaveFileButton);

            expect(button.length).toEqual(1);
        });

        it('should have selections', () => {
            const selections = renderComponent().find(DXFSelections);

            expect(selections.length).toEqual(1);
        });
    });
});
