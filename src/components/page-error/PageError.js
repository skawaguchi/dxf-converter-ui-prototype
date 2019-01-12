import React from 'react';
import { dxf as content } from '../../content/en.json';

import styles from './PageError.css';

export function PageError() {
    return (
        <div
            className={styles.container}
            data-hook='page-error'
        >
            <p>{ content.dxfError }</p>
        </div>
    );
}
