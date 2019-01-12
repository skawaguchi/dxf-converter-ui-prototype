import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DXFJSONViewer } from '../../components/dxf/DXFJSONViewer';
import { DXFSVGViewer } from '../../components/dxf/DXFSVGViewer';
import { TabGroup } from '../../components/tabs/TabGroup';

import styles from './DXFSource.css';
import { dxf as content } from '../../content/en.json';

const viewMap = {
    OUTPUT_JSON: 'OUTPUT_JSON',
    SOURCE_JSON: 'SOURCE_JSON',
    SVG: 'SVG'
};

const tabList = [
    {
        id: 'svg-tab',
        isSelected: true,
        label: content.svgButton,
        value: viewMap.SVG
    },
    {
        id: 'source-json-tab',
        isSelected: false,
        label: content.sourceJSONButton,
        value: viewMap.SOURCE_JSON
    },
    {
        id: 'output-json-tab',
        isSelected: false,
        label: content.outputJSONButton,
        value: viewMap.OUTPUT_JSON
    }
];

function testDocked(isDocked, displayedViewer) {
    return isDocked && displayedViewer === viewMap.SVG;
}

function getJSONDisplayType(id) {
    if (id.indexOf('json-tab') === -1) {
        return null;
    }

    return id === 'source-json-tab' ? 'SOURCE_JSON' : 'OUTPUT_JSON';
}

export class DXFSource extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayedViewer: viewMap.SVG,
            tabList,
            jsonType: null
        };
    }

    clickHandler = (event, id, value) => {
        const updatedTabList = this.state.tabList.map((tab) => ({
            ...tab,
            isSelected: tab.value === value
        }));

        const jsonType = getJSONDisplayType(id);

        this.setState({
            displayedViewer: value,
            tabList: updatedTabList,
            jsonType
        });
    }

    render() {
        const containerStyle = testDocked(this.props.isDocked, this.state.displayedViewer)
            ? styles.dockedContainer : styles.container;

        return (
            <div
                className={containerStyle}
                data-hook='dxf-source-viewer'
            >
                <TabGroup
                    clickHandler={this.clickHandler}
                    id='dxf-tab-group'
                    tabList={this.state.tabList}
                />
                {
                    this.state.displayedViewer === 'SVG' ?
                        <DXFSVGViewer
                            canvasSize={800}
                            id='d3-container'
                        /> :
                        <DXFJSONViewer type={this.state.jsonType}/>
                }
            </div>
        );
    }
}

DXFSource.propTypes = {
    isDocked: PropTypes.bool.isRequired
};
