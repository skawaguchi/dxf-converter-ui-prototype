/* eslint-disable complexity, no-restricted-syntax */

import slice from './slice';
import { getBuilder } from './builders/builderFactory';

function startSection(group) {
    return group.code === 0 && group.value === 'SECTION';
}

function endSection(group) {
    return group.code === 0 && group.value === 'ENDSEC';
}

export function processFile(data) {
    const result = {};
    let previousGroup = {};
    let builder;
    let activeSection;

    for (const group of slice(data)) {
        if (startSection(previousGroup)) {
            activeSection = group.value.toLowerCase();
            builder = getBuilder(group.value);
        } else if (builder && endSection(group)) {
            result[activeSection] = builder.getResult();
            builder = null;
        } else if (builder) {
            builder.addGroup(group);
        }

        previousGroup = group;
    }

    return result;
}
