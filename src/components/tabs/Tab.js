import React from 'react';
import PropTypes from 'prop-types';

import styles from '../../styles/Buttons.css';

const getClickHandler = (props) =>
    (event) => props.clickHandler(event, props.id, props.value);

export const Tab = (props) => {
    const className = props.isSelected ? styles.primaryReducedButton : styles.secondaryReducedButton;

    return (
        <button
            className={className}
            id={props.id}
            onClick={getClickHandler(props)}
        >
            {props.label}
        </button>
    );
};

Tab.propTypes = {
    clickHandler: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};
