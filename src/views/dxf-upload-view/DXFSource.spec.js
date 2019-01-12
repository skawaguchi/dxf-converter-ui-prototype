import React from 'react';
import { shallow } from 'enzyme';

import { DXFSource } from './DXFSource';

import { DXFJSONViewer } from '../../components/dxf/DXFJSONViewer';
import { DXFSVGViewer } from '../../components/dxf/DXFSVGViewer';
import { TabGroup } from '../../components/tabs/TabGroup';

import styles from './DXFSource.css';

describe('<DXFSource/>', () => {
    function renderComponent(overrides) {
        const props = {
            isDocked: false,
            ...overrides
        };

        return shallow(
            <DXFSource {...props}/>
        );
    }

    describe('Given the component renders', () => {
        it('should have an identifiable container element', () => {
            const container = renderComponent().find('div');

            expect(container.prop('data-hook')).toEqual('dxf-source-viewer');
        });

        it('should not display as docked', () => {
            const component = renderComponent({
                isDocked: true
            });

            expect(component.props().className).toEqual(styles.container);
        });

        it('should have tabs matching the required tab props for selecting which viewer to show', () => {
            const tabGroup = renderComponent().find(TabGroup);

            expect(tabGroup.props().id).toEqual('dxf-tab-group');

            const { tabList } = tabGroup.props();

            tabList.forEach((tab) => {
                expect(tab.id).toEqual(expect.any(String));
                expect(tab.isSelected).toEqual(expect.any(Boolean));
                expect(tab.label).toEqual(expect.any(String));
                expect(tab.value).toEqual(expect.any(String));
            });
        });

        it('should have an svg tab', () => {
            const tabGroup = renderComponent().find(TabGroup);

            const tab = tabGroup.props().tabList[0];

            expect(tab.value).toEqual('SVG');
        });

        it('should have a source json tab', () => {
            const tabGroup = renderComponent().find(TabGroup);

            const tab = tabGroup.props().tabList[1];

            expect(tab.value).toEqual('SOURCE_JSON');
        });

        it('should have an output json tab', () => {
            const tabGroup = renderComponent().find(TabGroup);

            const tab = tabGroup.props().tabList[2];

            expect(tab.value).toEqual('OUTPUT_JSON');
        });

        it('should display the svg viewer by default', () => {
            const viewer = renderComponent().find(DXFSVGViewer);

            expect(viewer.props().canvasSize).toEqual(800);
            expect(viewer.props().id).toEqual('d3-container');
        });

        it('should not display the json viewer by default', () => {
            const viewer = renderComponent().find(DXFJSONViewer);

            expect(viewer.length).toEqual(0);
        });

        describe('when the source json tab is clicked', () => {
            it('should select the source json tab', () => {
                const component = renderComponent();
                let tabGroup = component.find(TabGroup);

                const event = {};
                const id = 'source-json-tab';
                const value = 'SOURCE_JSON';

                tabGroup.props().clickHandler(event, id, value);

                component.update();

                tabGroup = component.find(TabGroup);

                const svgTab = tabGroup.props().tabList[0];
                const sourceJSONTab = tabGroup.props().tabList[1];
                const outputJSONTab = tabGroup.props().tabList[2];

                expect(svgTab.isSelected).toEqual(false);
                expect(sourceJSONTab.isSelected).toEqual(true);
                expect(outputJSONTab.isSelected).toEqual(false);
            });

            it('should show the source json viewer, and hide the svg viewer', () => {
                const component = renderComponent();
                const tabGroup = component.find(TabGroup);

                const event = {};
                const id = 'source-json-tab';
                const value = 'SOURCE_JSON';

                tabGroup.props().clickHandler(event, id, value);

                component.update();

                const jsonViewer = component.find(DXFJSONViewer);
                const svgViewer = component.find(DXFSVGViewer);

                expect(jsonViewer.props().type).toEqual(value);
                expect(svgViewer.length).toEqual(0);
            });
        });

        describe('when the output json tab is clicked', () => {
            it('should select the output json tab', () => {
                const component = renderComponent();
                let tabGroup = component.find(TabGroup);

                const event = {};
                const id = 'output-json-tab';
                const value = 'OUTPUT_JSON';

                tabGroup.props().clickHandler(event, id, value);

                component.update();

                tabGroup = component.find(TabGroup);

                const svgTab = tabGroup.props().tabList[0];
                const sourceJSONTab = tabGroup.props().tabList[1];
                const outputJSONTab = tabGroup.props().tabList[2];

                expect(svgTab.isSelected).toEqual(false);
                expect(sourceJSONTab.isSelected).toEqual(false);
                expect(outputJSONTab.isSelected).toEqual(true);
            });

            it('should show the output json viewer, and hide the svg viewer', () => {
                const component = renderComponent();
                const tabGroup = component.find(TabGroup);

                const event = {};
                const id = 'output-json-tab';
                const value = 'OUTPUT_JSON';

                tabGroup.props().clickHandler(event, id, value);

                component.update();

                const jsonViewer = component.find(DXFJSONViewer);
                const svgViewer = component.find(DXFSVGViewer);

                expect(jsonViewer.props().type).toEqual(value);
                expect(svgViewer.length).toEqual(0);
            });
        });

        describe('and the view is docked', () => {
            describe('and the view is the svg viewer', () => {
                it('should display as docked', () => {
                    const component = renderComponent({
                        isDocked: true
                    });

                    expect(component.props().className).toEqual(styles.dockedContainer);
                });
            });

            describe('and the view is the source json viewer', () => {
                it('should not display as docked', () => {
                    const component = renderComponent({
                        isDocked: true
                    });
                    const tabGroup = component.find(TabGroup);

                    tabGroup.props().clickHandler({}, 'source-json-tab', 'SOURCE_JSON');

                    component.update();

                    expect(component.props().className).toEqual(styles.container);
                });
            });

            describe('and the view is the output json viewer', () => {
                it('should not display as docked', () => {
                    const component = renderComponent({
                        isDocked: true
                    });
                    const tabGroup = component.find(TabGroup);

                    tabGroup.props().clickHandler({}, 'output-json-tab', 'OUTPUT_JSON');

                    component.update();

                    expect(component.props().className).toEqual(styles.container);
                });
            });

            describe('and the view is svg after being in a json tab', () => {
                it('should not display as docked', () => {
                    const component = renderComponent({
                        isDocked: true
                    });
                    const tabGroup = component.find(TabGroup);

                    tabGroup.props().clickHandler({}, 'source-json-tab', 'SOURCE_JSON');

                    component.update();

                    tabGroup.props().clickHandler({}, 'svg-tab', 'SVG');

                    component.update();

                    expect(component.props().className).toEqual(styles.container);
                });
            });
        });
    });
});
