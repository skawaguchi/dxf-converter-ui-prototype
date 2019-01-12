/* eslint-disable complexity */

import { getBuilder } from './builderFactory';

function append(attribute) {
    return (entityObj, value) => {
        entityObj[attribute] = value;
    };
}

const codeMap = {
    2: append('name'),
    3: append('name'),
    5: append('handle'),
    8: append('layerName'),
    10: append('x'),
    20: append('y'),
    30: append('z')
};

function entity(group) {
    return group.code === 0;
}

export default class BlockBuilder {
    constructor() {
        this.block = {
            entities: []
        };
        this.entityBuilder = null;
        this.withinEntities = false;
    }

    addGroup(group) {
        if (entity(group) || this.withinEntities) {
            this.withinEntities = true;

            if (this.entityBuilder) {
                if (entity(group)) {
                    this.block.entities.push(this.entityBuilder.getResult());
                    this.entityBuilder = getBuilder(group.value);

                    if (this.entityBuilder) {
                        this.entityBuilder.addGroup(group);
                    }
                } else {
                    this.entityBuilder.addGroup(group);
                }
            } else if (entity(group)) {
                this.entityBuilder = getBuilder(group.value);

                if (this.entityBuilder) {
                    this.entityBuilder.addGroup(group);
                }
            }
        } else {
            const handler = codeMap[group.code];

            if (handler) {
                handler(this.block, group.value);
            }
        }
    }

    getResult() {
        if (this.entityBuilder) {
            this.block.entities.push(this.entityBuilder.getResult());
        }
        return this.block;
    }
}
