import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';

import { makeStore } from '../stores/storeFactory';

export function StoreProvider(props) {
    const store = makeStore();

    return (
        <Provider store={ store }>
            { props.children }
        </Provider>
    );
}

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired
};
