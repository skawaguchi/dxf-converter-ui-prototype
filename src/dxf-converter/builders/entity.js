function determineSpace(entity, groupValue) {
    if (groupValue === 1) {
        entity.space = 'paper';
    }
}

function append(attribute) {
    return (entity, value) => {
        entity[attribute] = value;
    };
}

const codeMap = {
    0: append('type'),
    67: determineSpace
};

export default class EntityBuilder {
    constructor() {
        this.entity = {
            space: 'model'
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
