import React from 'react';

import { DXFTitleInput } from '../../components/dxf/DXFTitleInput';
import { DXFSelections } from '../../components/dxf/DXFSelections';
import { DXFDownloadJSONButton } from '../../components/dxf/DXFDownloadJSONButton';
import { DXFSaveFileButton } from '../../components/dxf/DXFSaveFileButton';

import styles from './DXFEditor.css';

export const DXFEditor = () => (
    <div
        className={styles.container}
        data-hook='dxf-editor'
    >
        <DXFTitleInput/>
        <DXFDownloadJSONButton/>
        <DXFSaveFileButton/>
        <DXFSelections/>
    </div>
);
