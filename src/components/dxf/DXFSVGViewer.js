import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { autorun } from 'mobx';

import {
    initializeSVG,
    renderDxfIntoSVG,
    resizeSVG
} from '../../dxf-renderer/dxf-renderer';

import { getSourceJSON } from '../../adapters/dxfAdapter';

import styles from './DXFSVGViewer.css';

@inject('store')
export class DXFSVGViewer extends Component {
    componentDidMount() {
        this.svg = initializeSVG(this.props.id, this.props.canvasSize);

        this.disposer = autorun(() => {
            const {
                blocks,
                dxf,
                layers,
                nonBlockEntities
            } = this.props.store.ui;

            if (dxf) {
                renderDxfIntoSVG(getSourceJSON(dxf, layers, blocks, nonBlockEntities), this.svg.select('g'));

                resizeSVG(this.svg);
            }
        });
    }

    componentWillUnmount() {
        this.disposer();
    }

    render() {
        return (
            <section
                className={styles.container}
                data-hook='dxf-svg-view'
            >
                <svg
                    id={this.props.id}
                />
            </section>
        );
    }
}

DXFSVGViewer.propTypes = {
    canvasSize: PropTypes.number,
    id: PropTypes.string,
    store: PropTypes.shape({
        ui: PropTypes.shape({
            blocks: PropTypes.arrayOf(PropTypes.object),
            dxf: PropTypes.object,
            layers: PropTypes.arrayOf(PropTypes.object),
            nonBlockEntities: PropTypes.object
        })
    })
};
