function determineSpace(builder, groupValue) {
    if (groupValue === 1) {
        builder.entity.space = 'paper';
    }
}

function setHandle(builder, groupValue) {
    builder.entity.handle = groupValue;
}

function setFlag(builder, groupValue) {
    if (groupValue === 1) {
        builder.entity.closed = true;
    }
}

function append(attribute) {
    return (builder, value) => {
        builder.entity.attributes[attribute] = value;
    };
}

function appendVertex(coordinate) {
    return (builder, value) => {
        if (builder.currentVertex && builder.currentVertex[coordinate] !== undefined) {
            builder.entity.attributes.vertices.push(builder.currentVertex);

            builder.currentVertex = {};
        }

        if (!builder.currentVertex) {
            builder.currentVertex = {};
        }

        builder.currentVertex[coordinate] = value;
    };
}

const codeMap = {
    5: setHandle,
    8: append('layerName'),
    10: appendVertex('x'),
    20: appendVertex('y'),
    30: appendVertex('z'),
    62: append('colorNumber'),
    67: determineSpace,
    70: setFlag,
    90: append('numberOfVertices')
};

export default class LwPolylineBuilder {
    constructor() {
        this.currentVertex = null;
        this.entity = {
            attributes: {
                vertices: []
            },
            space: 'model',
            type: 'lwpolyline'
        };
    }

    addGroup(group) {
        const handler = codeMap[group.code];

        if (handler) {
            handler(this, group.value);
        }
    }

    getResult() {
        if (this.currentVertex) {
            this.entity.attributes.vertices.push(this.currentVertex);
        }

        return this.entity;
    }
}
