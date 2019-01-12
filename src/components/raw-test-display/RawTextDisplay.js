import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './RawTextDisplay.css';
import buttons from '../../styles/Buttons.css';

import { dxf as content } from '../../content/en.json';

export class RawTextDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showRawText: false,
            text: ''
        };
    }

    rawTextClickHandler = () => {
        this.setState({
            showRawText: !this.state.showRawText,
            text: ''
        });
    }

    render() {
        const rawTextArea = this.state.showRawText &&
            (
                <textarea
                    cols='50'
                    data-hook='raw-text'
                    placeholder={content.rawTextPlaceholder}
                    readOnly
                    rows='30'
                    wrap='off'
                    value={this.props.text}
                />
            );
        const rawTextButtonText = this.state.showRawText ? content.rawTextButtonHide : content.rawTextButtonShow;

        return (
            <div
                className={styles.container}
                data-hook='raw-text-display'
            >
                <button
                    className={buttons.secondaryButton}
                    data-hook='raw-text-toggle'
                    onClick={this.rawTextClickHandler}
                >
                    {rawTextButtonText}
                </button>
                {rawTextArea}
            </div>
        );
    }
}

RawTextDisplay.propTypes = {
    text: PropTypes.string
};
