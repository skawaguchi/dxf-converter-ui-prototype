import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { dxf as content } from '../../content/en.json';

import styles from '../../styles/Buttons.css';

import { DXFData } from '../../models/DXFData';
import { DXFFile } from '../../models/DXFFile';

import { getOutputJSON } from '../../adapters/dxfAdapter';
import { downloadDXFJSON } from '../../services/downloadDXFJSONService';

@inject('store')
@observer
export class DXFDownloadJSONButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adaptedJSON: null
        };
    }

    clickHandler = () => {
        const {
            dxf,
            blocks,
            file,
            layers,
            nonBlockEntities
        } = this.props.store.ui;

        const adaptedJSON = getOutputJSON(dxf, layers, blocks, nonBlockEntities);

        this.setState({
            adaptedJSON
        });

        downloadDXFJSON(`${file.title}.json`, adaptedJSON);
    }

    render() {
        return (
            <button
                className={styles.primaryReducedButton}
                data-hook='download-json-button'
                onClick={this.clickHandler}
            >
                {content.downloadJSONButton}
            </button>
        );
    }
}

DXFDownloadJSONButton.propTypes = {
    store: PropTypes.shape({
        ui: PropTypes.shape({
            dxf: PropTypes.instanceOf(DXFData),
            blocks: PropTypes.arrayOf(PropTypes.object),
            file: PropTypes.instanceOf(DXFFile),
            layers: PropTypes.arrayOf(PropTypes.object),
            nonBlockEntities: PropTypes.object
        })
    })
};
