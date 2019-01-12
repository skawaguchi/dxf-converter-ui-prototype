import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { DXFFile } from '../../models/DXFFile';

import { dxf as content } from '../../content/en.json';
import styles from './DXFTitleInput.css';

@inject('store')
@observer
export class DXFTitleInput extends Component {
    changeHandler = (event) => {
        this.props.store.ui.setDXFTitle(event.target.value);
    };

    render() {
        return (
            <div
                className={styles.container}
                data-hook='dxf-title-input'
            >
                <label htmlFor='dxf-title-text-input'>
                    {content.titleInputLabel}
                </label>
                <input
                    id='dxf-title-text-input'
                    onChange={this.changeHandler}
                    placeholder={content.titleInputPlaceholder}
                    type='text'
                    value={this.props.store.ui.file.title}
                />
            </div>
        );
    }
}

DXFTitleInput.propTypes = {
    store: PropTypes.shape({
        ui: PropTypes.shape({
            file: PropTypes.instanceOf(DXFFile),
            setDXFTitle: PropTypes.func
        })
    })
};
