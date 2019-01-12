/* eslint-disable complexity */

import { getBuilder } from './builderFactory';

function startTable(group) {
    return group.code === 0 && group.value === 'TABLE';
}

function endTable(group) {
    return group.code === 0 && group.value === 'ENDTAB';
}

export default class BlocksBuilder {
    constructor() {
        this.tables = {};
    }

    addGroup(group) {
        if (startTable(group)) {
            this.builder = getBuilder('TABLE');
        } else if (this.builder && endTable(group)) {
            const table = this.builder.getResult();

            this.tables[table.name] = table;

            this.builder = null;
        } else if (this.builder) {
            this.builder.addGroup(group);
        }
    }

    getResult() {
        return this.tables;
    }
}
