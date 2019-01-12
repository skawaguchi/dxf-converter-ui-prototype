
function append(attribute) {
    return (insert, value) => {
        insert[attribute] = value;
    };
}

const codeMap = {
    2: append('blockName'),
    5: append('handle'),
    10: append('x'),
    20: append('y'),
    30: append('z'),
    41: append('xScale'),
    42: append('yScale'),
    43: append('zScale'),
    50: append('rotation'),
    210: append('extrusionX'),
    220: append('extrusionY'),
    230: append('extrusionZ')
};

export default class InsertBuilder {
    constructor() {
        this.insert = {
            type: 'insert'
        };
    }

    addGroup(group) {
        const handler = codeMap[group.code];

        if (handler) {
            handler(this.insert, group.value);
        }
    }

    getResult() {
        return this.insert;
    }
}
