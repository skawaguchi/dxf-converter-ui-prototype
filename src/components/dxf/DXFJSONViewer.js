import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { getSourceJSON, getOutputJSON } from '../../adapters/dxfAdapter';
import { DXFData } from '../../models/DXFData';

import styles from './DXFJSONViewer.css';

@inject('store')
@observer
export class DXFJSONViewer extends Component {
    render() {
        const {
            dxf,
            blocks,
            layers,
            nonBlockEntities
        } = this.props.store.ui;

        const jsonMethod = this.props.type === 'SOURCE_JSON' ? getSourceJSON : getOutputJSON;
        const json = jsonMethod(dxf, layers, blocks, nonBlockEntities);
        const displayedJSON = JSON.stringify(json, null, 2);

        return (
            <pre
                className={styles.container}
                data-hook='dxf-json-viewer'
            >
                {displayedJSON}
            </pre>
        );
    }
}

DXFJSONViewer.propTypes = {
    store: PropTypes.shape({
        ui: PropTypes.shape({
            dxf: PropTypes.instanceOf(DXFData),
            blocks: PropTypes.arrayOf(PropTypes.object),
            layers: PropTypes.arrayOf(PropTypes.object),
            nonBlockEntities: PropTypes.object
        })
    }),
    type: PropTypes.string.isRequired
};
