/* eslint-disable complexity */

import { getBuilder } from './builderFactory';

function append(attribute) {
    return (entryObj, value) => {
        entryObj[attribute] = value;
    };
}

const codeMap = {
    2: append('name')
};

function entry(group) {
    return group.code === 0;
}

export default class TableBuilder {
    constructor() {
        this.table = {
            entries: []
        };
        this.entryBuilder = null;
        this.withinEntries = false;
    }

    addGroup(group) {
        if (entry(group) || this.withinEntries) {
            this.withinEntries = true;

            if (this.entryBuilder) {
                if (entry(group)) {
                    this.table.entries.push(this.entryBuilder.getResult());
                    this.entryBuilder = getBuilder(group.value);

                    if (this.entryBuilder) {
                        this.entryBuilder.addGroup(group);
                    }
                } else {
                    this.entryBuilder.addGroup(group);
                }
            } else if (entry(group)) {
                this.entryBuilder = getBuilder(group.value);

                if (this.entryBuilder) {
                    this.entryBuilder.addGroup(group);
                }
            }
        } else {
            const handler = codeMap[group.code];

            if (handler) {
                handler(this.table, group.value);
            }
        }
    }

    getResult() {
        if (this.entryBuilder) {
            this.table.entries.push(this.entryBuilder.getResult());
        }
        return this.table;
    }
}
