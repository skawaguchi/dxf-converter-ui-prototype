import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { dxf as content } from '../../content/en.json';

import { DXFData } from '../../models/DXFData';
import { DXFFile } from '../../models/DXFFile';

import styles from '../../styles/Buttons.css';
import {
    getSourceJSON,
    getOutputJSON
} from '../../adapters/dxfAdapter';

@inject('store')
@observer
export class DXFSaveFileButton extends Component {
    clickHandler = () => {
        const {
            dxf,
            blocks,
            file,
            layers,
            nonBlockEntities,
            saveDXFFile
        } = this.props.store.ui;

        const sourceJSON = getSourceJSON(dxf, layers, blocks, nonBlockEntities);
        const outputJSON = getOutputJSON(dxf, layers, blocks, nonBlockEntities);

        saveDXFFile(file, sourceJSON, outputJSON);
    }

    render() {
        return (
            <button
                className={styles.primaryReducedButton}
                data-hook='save-file-button'
                onClick={this.clickHandler}
            >
                {content.saveFileButton}
            </button>
        );
    }
}

DXFSaveFileButton.propTypes = {
    store: PropTypes.shape({
        ui: PropTypes.shape({
            dxf: PropTypes.instanceOf(DXFData),
            blocks: PropTypes.arrayOf(PropTypes.object),
            file: PropTypes.instanceOf(DXFFile),
            layers: PropTypes.arrayOf(PropTypes.object),
            nonBlockEntities: PropTypes.object,
            rawFileText: PropTypes.string,
            saveDXFFile: PropTypes.func
        })
    })
};
