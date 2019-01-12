/* eslint-disable complexity */

import { getBuilder } from './builderFactory';

function startBlock(group) {
    return group.code === 0 && group.value === 'BLOCK';
}

function endBlock(group) {
    return group.code === 0 && group.value === 'ENDBLK';
}

export default class BlocksBuilder {
    constructor() {
        this.blocks = [];
    }

    addGroup(group) {
        if (startBlock(group)) {
            this.builder = getBuilder('BLOCK');
        } else if (this.builder && endBlock(group)) {
            const block = this.builder.getResult();

            this.blocks.push(block);

            this.builder = null;
        } else if (this.builder) {
            this.builder.addGroup(group);
        }
    }

    getResult() {
        return this.blocks;
    }
}
