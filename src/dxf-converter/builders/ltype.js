function append(attribute) {
    return (entity, value) => {
        entity[attribute] = value;
    };
}

const codeMap = {
    2: append('name'),
    3: append('description'),
    73: append('numberOfElements'),
    40: append('totalPatternLength')
};

export default class LtypeBuilder {
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
