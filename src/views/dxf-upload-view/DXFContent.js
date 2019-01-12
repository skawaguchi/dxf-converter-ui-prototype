import React, { Component } from 'react';

import Waypoint from 'react-waypoint';

import { DXFSource } from './DXFSource';
import { DXFEditor } from './DXFEditor';

import styles from './DXFContent.css';

export class DXFContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDocked: false
        };
    }

    positionChangeHandler = ({ currentPosition }) => {
        this.setState({
            isDocked: currentPosition === 'above'
        });
    }

    render() {
        return (
            <section
                className={styles.container}
                data-hook='dxf-content'
            >
                <Waypoint
                    onPositionChange={this.positionChangeHandler}
                />
                <div className={styles.contentContainer}>
                    <DXFEditor/>
                    <DXFSource
                        isDocked={this.state.isDocked}
                    />
                </div>
            </section>
        );
    }
}
