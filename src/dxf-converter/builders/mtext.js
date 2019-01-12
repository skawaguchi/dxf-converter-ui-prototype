function setHandle(entity, groupValue) {
    entity.handle = groupValue;
}

function append(attribute) {
    return (entity, value) => {
        entity[attribute] = value;
    };
}

const codeMap = {
    1: append('textString'),
    2: append('name'),
    5: setHandle,
    10: append('x'),
    20: append('y'),
    30: append('z'),
    40: append('textHeight'),
    41: append('rectangleWidth'),
    50: append('rotationAngle'),
    71: append('attachmentPoint'),
    72: append('drawingDirection'),
    73: append('lineSpacing')
};

export default class MTextBuilder {
    constructor() {
        this.entity = {
            attributes: {},
            space: 'model',
            type: 'mline'
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
