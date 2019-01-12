function determineSpace(entity, groupValue) {
    if (groupValue === 1) {
        entity.space = 'paper';
    }
}

function setHandle(entity, groupValue) {
    entity.handle = groupValue;
}

function append(attribute) {
    return (entity, value) => {
        entity.attributes[attribute] = value;
    };
}

const codeMap = {
    5: setHandle,
    8: append('layerName'),
    40: append('r'),
    10: append('cx'),
    20: append('cy'),
    30: append('cz'),
    62: append('colorNumber'),
    67: determineSpace
};

export default class CircleBuilder {
    constructor() {
        this.entity = {
            attributes: {},
            space: 'model',
            type: 'circle'
        };
    }

    addGroup(group) {
        const handler = codeMap[group.code];

        if (handler) {
            handler(this.entity, group.value);
        }
    }

    getResult() {
        return this.entity;
    }
}
