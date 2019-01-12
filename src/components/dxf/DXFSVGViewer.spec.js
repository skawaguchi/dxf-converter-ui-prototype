import React from 'react';
import { shallow } from 'enzyme';
import Chance from 'chance';
import sinon from 'sinon';
import * as mobx from 'mobx';

import { DXFSVGViewer } from './DXFSVGViewer';

import * as dxfRenderer from '../../dxf-renderer/dxf-renderer';
import * as dxfAdapter from '../../adapters/dxfAdapter';
import {
    getSelectionBlock,
    getDXFDataModel,
    getSelectionLayer,
    getNonBlockEntities
} from '../../mockUtils';

const chance = new Chance();
const sandbox = sinon.createSandbox();

describe('<DXFSVGView/>', () => {
    afterEach(() => {
        sandbox.restore();
    });

    const getProps = (overrides) => ({
        canvasSize: chance.natural(),
        id: chance.word(),
        store: {
            ui: {
                blocks: [
                    getSelectionBlock()
                ],
                dxf: {},
                layers: [
                    getSelectionLayer()
                ],
                nonBlockEntities: getNonBlockEntities()
            }
        },
        ...overrides
    });

    const getSVGMock = (svgGroup) => ({
        select: () => svgGroup
    });

    function renderComponent(props = getProps(), svgMock) {
        const svgGroup = {};
        const svg = typeof svgMock !== 'undefined' ? svgMock : getSVGMock(svgGroup);
        const dxfMock = getDXFDataModel();

        const initializeSVGStub = sandbox.stub(dxfRenderer, 'initializeSVG');
        const renderDxfIntoSVGStub = sandbox.stub(dxfRenderer, 'renderDxfIntoSVG');
        const resizeDxfStub = sandbox.stub(dxfRenderer, 'resizeSVG');
        const autoRunStub = sandbox.stub(mobx, 'autorun');
        const disposerStub = sandbox.stub();
        const dxfAdapterStub = sandbox.stub(dxfAdapter, 'getSourceJSON');

        autoRunStub.returns(disposerStub);
        initializeSVGStub.returns(svg);
        dxfAdapterStub.returns(dxfMock);

        const component = shallow(
            <DXFSVGViewer {...props}/>
        ).dive();

        return {
            autoRunStub,
            disposerStub,
            dxfAdapterStub,
            dxfMock,
            component,
            initializeSVGStub,
            renderDxfIntoSVGStub,
            resizeDxfStub,
            svg,
            svgGroup
        };
    }

    describe('Given the component renders', () => {
        it('should have a container element', () => {
            const {
                component
            } = renderComponent();

            expect(component.type()).toEqual('section');
            expect(component.prop('data-hook')).toEqual('dxf-svg-view');
        });

        it('should display an svg with the provided id', () => {
            const props = getProps();
            const svg = renderComponent(props).component.find('svg');

            expect(svg.props().id).toEqual(props.id);
        });

        it('should filter out the selections on the dxf', () => {
            const props = getProps();
            const {
                autoRunStub,
                dxfAdapterStub
            } = renderComponent(props);

            autoRunStub.callArg(0);

            sandbox.assert.calledWithExactly(
                dxfAdapterStub,
                props.store.ui.dxf,
                props.store.ui.layers,
                props.store.ui.blocks,
                props.store.ui.nonBlockEntities
            );
        });

        it('should initialize the svg in preparation for dxf rendering', () => {
            const props = getProps();
            const {
                autoRunStub,
                dxfMock,
                renderDxfIntoSVGStub,
                svgGroup
            } = renderComponent(props);

            sandbox.assert.notCalled(renderDxfIntoSVGStub);

            autoRunStub.callArg(0);

            sandbox.assert.calledOnce(renderDxfIntoSVGStub);
            sandbox.assert.calledWithExactly(renderDxfIntoSVGStub, dxfMock, svgGroup);
        });

        describe('Given no dxf', () => {
            it('should not render', () => {
                const props = getProps({
                    store: {
                        ui: {
                            blocks: [],
                            dxf: null
                        }
                    }
                });

                const noSVG = null;
                const {
                    autoRunStub,
                    renderDxfIntoSVGStub,
                    resizeDxfStub
                } = renderComponent(props, noSVG);

                autoRunStub.callArg(0);

                sandbox.assert.notCalled(renderDxfIntoSVGStub);
                sandbox.assert.notCalled(resizeDxfStub);
            });
        });
    });

    describe('Given the dxf or block data has changed', () => {
        it('should automatically render updates to the svg', () => {
            const props = getProps();
            const {
                initializeSVGStub
            } = renderComponent(props);

            sandbox.assert.calledOnce(initializeSVGStub);
            sandbox.assert.calledWithExactly(initializeSVGStub, props.id, props.canvasSize);
        });
    });

    describe('Given the component will unmount', () => {
        it('should tidy up the automatic svg rendering', () => {
            const {
                component,
                disposerStub
            } = renderComponent();

            sandbox.assert.notCalled(disposerStub);

            component.unmount();

            sandbox.assert.calledOnce(disposerStub);
        });
    });
});
