import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { DXFSelections } from './DXFSelections';

import * as checkboxAdapter from '../../adapters/checkboxAdapter';
import * as dxfElementService from '../../services/dxfElementService';

import styles from '../../styles/Theme.css';

import {
    getCheckbox,
    getDXFDataModel,
    getNonBlockEntities,
    getSelectionBlock,
    getSelectionLayer
} from '../../mockUtils';

const sandbox = sinon.sandbox.create();

describe('<DXFSelections/>', () => {
    function renderComponent(overrides) {
        const storeMock = {
            ui: {
                blocks: [
                    getSelectionBlock()
                ],
                changeBlockSelection: sandbox.stub(),
                changeLayerSelection: sandbox.stub(),
                dxf: getDXFDataModel(),
                layers: [
                    getSelectionLayer()
                ],
                nonBlockEntities: getNonBlockEntities(),
                toggleNonBlockEntitiesSelection: sandbox.stub(),
                ...overrides
            }
        };

        const blockInsertionStub = sandbox.stub(dxfElementService, 'getBlockInsertions');
        const layerInsertionStub = sandbox.stub(dxfElementService, 'getLayerInsertionsAndEntities');
        const nonBlockEntitiesStub = sandbox.stub(dxfElementService, 'getNonBlockEntities');

        const blockCheckboxStub = sandbox.stub(checkboxAdapter, 'getBlockCheckboxes');
        const layerCheckboxStub = sandbox.stub(checkboxAdapter, 'getLayerCheckboxes');
        const querySelectorStub = sandbox.stub(document, 'querySelector');

        const component = shallow(
            <DXFSelections store={ storeMock } />
        ).dive();

        return {
            blockCheckboxStub,
            blockInsertionStub,
            component,
            layerCheckboxStub,
            layerInsertionStub,
            nonBlockEntitiesStub,
            querySelectorStub,
            storeMock
        };
    }

    afterEach(() => {
        sandbox.restore();
    });

    describe('Given the component renders', () => {
        it('should have a containing element with a hook for testing', () => {
            const {
                component
            } = renderComponent();

            expect(component.type()).toEqual('div');
            expect(component.prop('data-hook')).toEqual('dxf-selections');
        });

        function assertSelections(type, selectionsIndex) {
            it(`should show the ${type} selections`, () => {
                const {
                    blockCheckboxStub,
                    component,
                    layerCheckboxStub,
                    storeMock
                } = renderComponent();

                const adaptedBlockCheckboxes = [
                    getCheckbox()
                ];
                blockCheckboxStub.returns(adaptedBlockCheckboxes);

                const adaptedLayerCheckboxes = [
                    getCheckbox()
                ];
                layerCheckboxStub.returns(adaptedLayerCheckboxes);

                const header = component.find(`h2.${type}`);
                const checkboxGroup = component.childAt(selectionsIndex);

                const stub = type === 'blocks' ? blockCheckboxStub : layerCheckboxStub;
                const adaptedCheckboxes = type === 'blocks' ? adaptedBlockCheckboxes : adaptedLayerCheckboxes;

                expect(header.text().length).toBeGreaterThan(0);

                sandbox.assert.calledWithExactly(stub, storeMock.ui[type]);

                expect(checkboxGroup.prop('id')).toEqual(adaptedCheckboxes.id);
                expect(checkboxGroup.prop('isSelected')).toEqual(adaptedCheckboxes.isSelected);
                expect(checkboxGroup.prop('label')).toEqual(adaptedCheckboxes.label);
                expect(checkboxGroup.prop('value')).toEqual(adaptedCheckboxes.value);
            });
        }

        assertSelections('layers', 3);

        assertSelections('blocks', 5);

        describe('when a block checkbox is changed', () => {
            it('should change the block selection', () => {
                const {
                    component,
                    storeMock
                } = renderComponent();

                const block = storeMock.ui.blocks[0];
                const event = {};

                component.childAt(5).props().changeHandler(event, block.id);

                sandbox.assert.calledWithExactly(storeMock.ui.changeBlockSelection, block.id);
            });
        });

        describe('when a layer checkbox is changed', () => {
            it('should change the layer selection', () => {
                const {
                    component,
                    storeMock
                } = renderComponent();

                const layer = storeMock.ui.layers[0];
                const event = {};

                component.childAt(3).props().changeHandler(event, layer.name);

                sandbox.assert.calledWithExactly(storeMock.ui.changeLayerSelection, layer.name);
            });
        });

        describe('when the non-block entity checkbox is changed', () => {
            it('should change the non-block entity selection', () => {
                const {
                    component,
                    storeMock
                } = renderComponent();

                const layer = storeMock.ui.layers[0];
                const event = {};

                component.childAt(1).props().changeHandler(event, layer.name);

                sandbox.assert.calledOnce(storeMock.ui.toggleNonBlockEntitiesSelection);
            });
        });

        function assertElementMouseEvent({ childIndex, color, dataTarget, elementType, eventHandler, eventType }) {
            describe(`when a ${elementType} checkbox is moused ${eventType}`, () => {
                it(`should find the insertions for the ${elementType}`, () => {
                    const {
                        blockInsertionStub,
                        component,
                        layerInsertionStub,
                        storeMock
                    } = renderComponent();

                    const stub = elementType === 'block' ? blockInsertionStub : layerInsertionStub;
                    const uiTarget = storeMock.ui[dataTarget][0];
                    const { dxf } = storeMock.ui;
                    const event = {};

                    stub.returns(['some-handle']);

                    component.childAt(childIndex).props()[eventHandler](event, uiTarget.handle, uiTarget.name);

                    sandbox.assert.calledWithExactly(stub, dxf, uiTarget.name);
                });

                describe('and there are insertions', () => {
                    describe('and elements matching the handles', () => {
                        it('should highlight the insertions', () => {
                            const {
                                blockInsertionStub,
                                component,
                                layerInsertionStub,
                                querySelectorStub,
                                storeMock
                            } = renderComponent();

                            const stub = elementType === 'block' ? blockInsertionStub : layerInsertionStub;
                            const uiTarget = storeMock.ui[dataTarget][0];
                            const event = {};
                            const insertionHandle = 'some-insert-handle';
                            const insertionHandlesMock = [insertionHandle];
                            const itemMock = {
                                style: {
                                    stroke: ''
                                }
                            };

                            querySelectorStub.returns(itemMock);

                            stub.returns(insertionHandlesMock);

                            component.childAt(childIndex).props()[eventHandler](event, uiTarget.handle, uiTarget.name);

                            sandbox.assert.calledWithExactly(querySelectorStub, `#handle-${insertionHandle}`);
                            expect(itemMock.style.stroke).toEqual(color);
                        });
                    });

                    describe('and no elements matching the handles', () => {
                        it('should do nothing', () => {
                            const {
                                blockInsertionStub,
                                component,
                                layerInsertionStub,
                                querySelectorStub,
                                storeMock
                            } = renderComponent();

                            const stub = elementType === 'block' ? blockInsertionStub : layerInsertionStub;
                            const uiTarget = storeMock.ui[dataTarget][0];
                            const event = {};

                            querySelectorStub.returns(null);

                            stub.returns([
                                'some-insert-handle'
                            ]);

                            component.childAt(childIndex).props()[eventHandler](event, uiTarget.handle, uiTarget.name);

                            sandbox.assert.calledOnce(querySelectorStub);
                        });
                    });
                });

                describe('and there are no insertions', () => {
                    it('should not do anything', () => {
                        const {
                            blockInsertionStub,
                            component,
                            layerInsertionStub,
                            querySelectorStub,
                            storeMock
                        } = renderComponent();

                        const stub = elementType === 'block' ? blockInsertionStub : layerInsertionStub;
                        const uiTarget = storeMock.ui[dataTarget][0];
                        const event = {};

                        stub.returns([]);

                        component.childAt(childIndex).props()[eventHandler](event, uiTarget.handle, uiTarget.name);

                        sandbox.assert.notCalled(querySelectorStub);
                    });
                });
            });
        }

        assertElementMouseEvent({
            childIndex: 5,
            color: styles.burningOrange,
            dataTarget: 'blocks',
            elementType: 'block',
            eventHandler: 'mouseOverHandler',
            eventType: 'over'
        });

        assertElementMouseEvent({
            childIndex: 5,
            color: styles.white,
            dataTarget: 'blocks',
            elementType: 'block',
            eventHandler: 'mouseOutHandler',
            eventType: 'out'
        });

        assertElementMouseEvent({
            childIndex: 3,
            color: styles.burningOrange,
            dataTarget: 'layers',
            elementType: 'layer',
            eventHandler: 'mouseOverHandler',
            eventType: 'over'
        });

        assertElementMouseEvent({
            childIndex: 3,
            color: styles.white,
            dataTarget: 'layers',
            elementType: 'layer',
            eventHandler: 'mouseOutHandler',
            eventType: 'out'
        });

        function assertNonBlockEntitiesMouseEvent({ color, eventHandler, eventType }) {
            describe(`when the non-block entities checkbox is moused ${eventType}`, () => {
                it('should find the entities for the non-block-entities', () => {
                    const {
                        component,
                        nonBlockEntitiesStub,
                        storeMock
                    } = renderComponent();

                    const { dxf } = storeMock.ui;

                    nonBlockEntitiesStub.returns(['some-handle']);

                    component.childAt(1).props()[eventHandler]();

                    sandbox.assert.calledWithExactly(nonBlockEntitiesStub, dxf);
                });

                describe('and there are entities', () => {
                    describe('and elements matching the handles', () => {
                        it('should highlight the insertions', () => {
                            const {
                                component,
                                nonBlockEntitiesStub,
                                querySelectorStub
                            } = renderComponent();

                            const insertionHandle = 'some-insert-handle';
                            const insertionHandlesMock = [insertionHandle];
                            const itemMock = {
                                style: {
                                    stroke: ''
                                }
                            };

                            querySelectorStub.returns(itemMock);

                            nonBlockEntitiesStub.returns(insertionHandlesMock);

                            component.childAt(1).props()[eventHandler]();

                            sandbox.assert.calledWithExactly(querySelectorStub, `#handle-${insertionHandle}`);
                            expect(itemMock.style.stroke).toEqual(color);
                        });
                    });

                    describe('and no elements matching the handles', () => {
                        it('should do nothing', () => {
                            const {
                                component,
                                nonBlockEntitiesStub,
                                querySelectorStub
                            } = renderComponent();

                            querySelectorStub.returns(null);

                            nonBlockEntitiesStub.returns([
                                'some-insert-handle'
                            ]);

                            component.childAt(1).props()[eventHandler]();

                            sandbox.assert.calledOnce(querySelectorStub);
                        });
                    });
                });

                describe('and there are no insertions', () => {
                    it('should not do anything', () => {
                        const {
                            component,
                            nonBlockEntitiesStub,
                            querySelectorStub
                        } = renderComponent();

                        nonBlockEntitiesStub.returns([]);

                        component.childAt(1).props()[eventHandler]();

                        sandbox.assert.notCalled(querySelectorStub);
                    });
                });
            });
        }

        assertNonBlockEntitiesMouseEvent({
            color: styles.burningOrange,
            eventHandler: 'mouseOverHandler',
            eventType: 'over'
        });
        assertNonBlockEntitiesMouseEvent({
            color: styles.white,
            eventHandler: 'mouseOutHandler',
            eventType: 'out'
        });
    });
});

