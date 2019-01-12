import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tab } from './Tab';

import styles from './TabGroup.css';

export class TabGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null
        };
    }

    componentDidMount() {
        this.setState({
            selected: this.props.tabList[0].id
        });
    }

    clickHandler = (event, id, value) => {
        this.setState({
            selected: id
        });

        this.props.clickHandler(event, id, value);
    }

    render() {
        return (
            <div
                className={styles.container}
                data-hook={this.props.id}
            >
                {
                    this.props.tabList.map((tab) => (
                        <Tab
                            clickHandler={this.clickHandler}
                            id={tab.id}
                            isSelected={this.state.selected === tab.id}
                            key={tab.id}
                            label={tab.label}
                            value={tab.value}
                        />
                    ))
                }
            </div>
        );
    }
}

TabGroup.propTypes = {
    clickHandler: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    tabList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            isSelected: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    )
};
