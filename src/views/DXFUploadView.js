import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { DXFFileInput } from '../components/dxf/DXFFileInput';
import { PageError } from '../components/page-error/PageError';
import { DXFData } from '../models/DXFData';
import { DXFContent } from './dxf-upload-view/DXFContent';

import { getFileChangeHandler } from '../services/fileReaderService';

import styles from './DXFUploadView.css';
import { pageErrorTypes } from '../constants/pageErrors';

@inject('store')
@observer
export class DXFUploadView extends Component {
    componentWillMount() {
        this.props.store.ui.setSaveDXFFileCallback(
            this.props.handleDXFFileSave
        );
    }

    render() {
        const hasPageError = this.props.store.ui.pageError === pageErrorTypes.DXF_READ_ERROR;
        const dxfContent = this.props.store.ui.dxf && <DXFContent/>;

        return (
            <section data-hook='dxf-upload-view'>
                <div className={styles.container}>
                    <DXFFileInput
                        changeHandler={getFileChangeHandler(this.props.store.ui)}
                    />
                    {
                        hasPageError ? <PageError/> : dxfContent
                    }
                </div>
            </section>
        );
    }
}

DXFUploadView.propTypes = {
    handleDXFFileSave: PropTypes.func.isRequired,
    store: PropTypes.shape({
        ui: PropTypes.shape({
            dxf: PropTypes.instanceOf(DXFData),
            pageError: PropTypes.string,
            setSaveDXFFileCallback: PropTypes.func
        })
    })
};
