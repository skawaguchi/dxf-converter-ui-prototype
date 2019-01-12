import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from './Checkbox';

import styles from './CheckboxGroup.css';

export class CheckboxGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkboxes: props.checkboxes
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            checkboxes: nextProps.checkboxes
        });
    }

    changeHandler = (event, id, value) => {
        const checkboxes = this.state.checkboxes.map((checkbox) => {
            const newCheckbox = {
                ...checkbox
            };
            if (newCheckbox.id === id) {
                newCheckbox.isSelected = !checkbox.isSelected;
            }
            return newCheckbox;
        });

        this.setState({
            checkboxes
        });

        this.props.changeHandler(event, id, value);
    };

    mouseOverHandler = (event, id, value) => {
        this.props.mouseOverHandler(event, id, value);
    }

    mouseOutHandler = (event, id, value) => {
        this.props.mouseOutHandler(event, id, value);
    }

    render() {
        return (
            <div
                className={styles.container}
                data-hook={`checkbox-group ${this.props.className}`}
            >
                {
                    this.state.checkboxes.map((checkbox) => (
                        <Checkbox
                            changeHandler={this.changeHandler}
                            key={checkbox.id}
                            id={checkbox.id}
                            isDisabled={checkbox.isDisabled}
                            isSelected={checkbox.isSelected}
                            label={checkbox.label}
                            mouseOutHandler={this.mouseOutHandler}
                            mouseOverHandler={this.mouseOverHandler}
                            value={checkbox.value}
                        />
                    ))
                }
            </div>
        );
    }
}

CheckboxGroup.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    checkboxes: PropTypes.arrayOf(
        PropTypes.shape({
            changeHandler: PropTypes.func,
            className: PropTypes.string,
            id: PropTypes.string.isRequired,
            isDisabled: PropTypes.bool,
            isSelected: PropTypes.bool.isRequired,
            label: PropTypes.node.isRequired,
            mouseOutHandler: PropTypes.func,
            mouseOverHandler: PropTypes.func,
            title: PropTypes.string,
            value: PropTypes.string.isRequired
        })
    ),
    className: PropTypes.string.isRequired,
    mouseOutHandler: PropTypes.func,
    mouseOverHandler: PropTypes.func
};
