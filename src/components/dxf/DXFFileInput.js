import React from 'react';
import PropTypes from 'prop-types';

import ReactFileReader from 'react-file-reader';

import styles from './DXFFileInput.css';
import buttonStyles from '../../styles/Buttons.css';

import { dxf as content } from '../../content/en.json';

export function DXFFileInput(props) {
    return (
        <div className={styles.container}>
            <ReactFileReader
                base64={false}
                fileTypes={['dxf']}
                handleFiles={props.changeHandler}
                multipleFiles={false}
            >
                <button
                    className={`${buttonStyles.primaryButton}`}
                    data-hook='file-button'
                >
                    {content.dxfButton}
                </button>
            </ReactFileReader>
        </div>
    );
}

DXFFileInput.propTypes = {
    changeHandler: PropTypes.func.isRequired
};
