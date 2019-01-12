import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { Checkbox } from '../checkboxes/Checkbox';
import { CheckboxGroup } from '../checkboxes/CheckboxGroup';

import {
    getBlockCheckboxes,
    getLayerCheckboxes
} from '../../adapters/checkboxAdapter';
import {
    getBlockInsertions,
    getLayerInsertionsAndEntities,
    getNonBlockEntities
} from '../../services/dxfElementService';
import { DXFData } from '../../models/DXFData';

import { dxf as content } from '../../content/en.json';
import styles from './DXFSelections.css';
import theme from '../../styles/Theme.css';

const highlightElements = (dxf, handlerMethod, value, colorName) => {
    const handles = handlerMethod(dxf, value);

    if (handles.length > 0) {
        handles.forEach((handle) => {
            const item = document.querySelector(`#handle-${handle}`);

            if (item) {
                item.style.stroke = colorName;
            }
        });
    }
};

const highlightNonBlockEntities = (dxf, handlerMethod, colorName) => {
    const handles = handlerMethod(dxf);

    if (handles.length > 0) {
        handles.forEach((handle) => {
            const item = document.querySelector(`#handle-${handle}`);

            if (item) {
                item.style.stroke = colorName;
            }
        });
    }
};

@inject('store')
@observer
export class DXFSelections extends Component {
    toggleNonBlockEntities = () => {
        this.props.store.ui.toggleNonBlockEntitiesSelection();
    }

    changeBlocks = (event, handle) => {
        this.props.store.ui.changeBlockSelection(handle);
    }

    changeLayers = (event, name) => {
        this.props.store.ui.changeLayerSelection(name);
    }

    mouseOverBlocks = (event, id, value) => {
        const { dxf } = this.props.store.ui;

        highlightElements(dxf, getBlockInsertions, value, theme.burningOrange);
    }

    mouseOutBlocks = (event, id, value) => {
        const { dxf } = this.props.store.ui;

        highlightElements(dxf, getBlockInsertions, value, theme.white);
    }

    mouseOverLayers = (event, id, value) => {
        const { dxf } = this.props.store.ui;

        highlightElements(dxf, getLayerInsertionsAndEntities, value, theme.burningOrange);
    }

    mouseOutLayers = (event, id, value) => {
        const { dxf } = this.props.store.ui;

        highlightElements(dxf, getLayerInsertionsAndEntities, value, theme.white);
    }

    mouseOverNonBlockEntities = () => {
        const { dxf } = this.props.store.ui;

        highlightNonBlockEntities(dxf, getNonBlockEntities, theme.burningOrange);
    }

    mouseOutNonBlockEntities = () => {
        const { dxf } = this.props.store.ui;

        highlightNonBlockEntities(dxf, getNonBlockEntities, theme.white);
    }


    render() {
        const { blocks, layers } = this.props.store.ui;

        const blockCheckboxes = getBlockCheckboxes(blocks);
        const layerCheckboxes = getLayerCheckboxes(layers);

        return (
            <div
                className={styles.container}
                data-hook='dxf-selections'
            >
                <h2 className='nonBlockEntities'>{content.nonBlockEntitiesSelectionsHeader}</h2>
                <Checkbox
                    changeHandler={this.toggleNonBlockEntities}
                    id='non-block-entity-checkbox'
                    isSelected={this.props.store.ui.nonBlockEntities.isSelected}
                    label={content.nonBlockEntitiesCheckbox}
                    mouseOutHandler={this.mouseOutNonBlockEntities}
                    mouseOverHandler={this.mouseOverNonBlockEntities}
                    value='non-block-entity-checkbox'
                />

                <h2 className='layers'>{content.layerSelectionsHeader}</h2>
                <CheckboxGroup
                    changeHandler={this.changeLayers}
                    className='layer-checkboxes'
                    checkboxes={layerCheckboxes}
                    mouseOutHandler={this.mouseOutLayers}
                    mouseOverHandler={this.mouseOverLayers}
                />

                <h2 className='blocks'>{content.blockSelectionsHeader}</h2>
                <CheckboxGroup
                    changeHandler={this.changeBlocks}
                    className='block-checkboxes'
                    checkboxes={blockCheckboxes}
                    mouseOutHandler={this.mouseOutBlocks}
                    mouseOverHandler={this.mouseOverBlocks}
                />
            </div>
        );
    }
}

DXFSelections.propTypes = {
    store: PropTypes.shape({
        ui: PropTypes.shape({
            blocks: PropTypes.arrayOf(PropTypes.object),
            dxf: PropTypes.instanceOf(DXFData),
            changeBlockSelection: PropTypes.func.isRequired,
            changeLayerSelection: PropTypes.func.isRequired,
            layers: PropTypes.arrayOf(PropTypes.object),
            nonBlockEntities: PropTypes.object,
            toggleNonBlockEntitiesSelection: PropTypes.func.isRequired
        })
    })
};
