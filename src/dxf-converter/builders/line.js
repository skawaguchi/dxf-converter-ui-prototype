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
    10: append('x1'),
    20: append('y1'),
    30: append('z1'),
    11: append('x2'),
    21: append('y2'),
    31: append('z2'),
    62: append('colorNumber'),
    67: determineSpace
};

export default class LineBuilder {
    constructor() {
        this.entity = {
            attributes: {},
            space: 'model',
            type: 'line'
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
