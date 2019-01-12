import React from 'react';

import { StoreProvider } from './StoreProvider';
import { DXFUploadView } from './DXFUploadView';

import { dxf as content } from '../content/en.json';

import styles from './App.css';

const noop = () => {};

export function App() {
    return (
        <StoreProvider>
            <main
                className={`${styles.appMain}`}
                data-hook='dxf-converter'
            >
                <h1>{content.title}</h1>
                <p>{content.intro}</p>

                <DXFUploadView
                    handleDXFFileSave={noop}
                />
            </main>
        </StoreProvider>
    );
}
