import React from 'react';
import PropTypes from 'prop-types';

import styles from './Checkbox.css';

const getChangeHandler = (props) =>
    (event) => props.changeHandler(event, props.id, props.value);

const getMouseOverHandler = (props) =>
    (event) => props.mouseOverHandler(event, props.id, props.value);

const getMouseOutHandler = (props) =>
    (event) => props.mouseOutHandler(event, props.id, props.value);

export function Checkbox(props) {
    const className = props.isIndeterminate ? styles.indeterminateContainer : styles.container;
    const dataHooks = props.className ? `checkbox ${props.className}` : 'checkbox';

    return (
        <div
            className={className}
            data-hook={dataHooks}
            onMouseOut={getMouseOutHandler(props)}
            onMouseOver={getMouseOverHandler(props)}
        >
            <input
                id={props.id}
                checked={props.isSelected}
                disabled={props.isDisabled}
                name={props.id}
                onChange={getChangeHandler(props)}
                type='checkbox'
                value={props.value}
            />
            <label
                htmlFor={props.id}
                title={props.title}
            >
                {props.label}
            </label>
        </div>
    );
}

Checkbox.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    isIndeterminate: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    label: PropTypes.node.isRequired,
    mouseOutHandler: PropTypes.func,
    mouseOverHandler: PropTypes.func,
    title: PropTypes.string,
    value: PropTypes.string.isRequired
};
