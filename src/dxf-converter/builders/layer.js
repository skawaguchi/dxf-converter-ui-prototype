function append(attribute) {
    return (entity, value) => {
        entity[attribute] = value;
    };
}

function setFlags(entity, value) {
    if (value === 1) {
        entity.frozen = true;
    }
}

const codeMap = {
    2: append('name'),
    6: append('lineType'),
    62: append('colorNumber'),
    70: setFlags,
    290: append('plottingFlag')
};

export default class LayerBuilder {
    constructor() {
        this.entity = {};
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
