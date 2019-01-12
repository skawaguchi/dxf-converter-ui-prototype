function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = angleInDegrees * (Math.PI / 180.0);

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
}

function arcToPath(attributes) {
    return {
        d: describeArc(
            attributes.cx,
            attributes.cy,
            attributes.radius,
            attributes.startAngle,
            attributes.endAngle
        )
    };
}

function closeLoop(verticies) {
    return verticies.concat(verticies[0]);
}

function verticesToPolyline(attributes, closedFlag) {
    const vertices = closedFlag ? closeLoop(attributes.vertices) : attributes.vertices;

    return {
        points: vertices.map((vertex) => `${vertex.x},${vertex.y}`).join(' ')
    };
}

function mtextToText(attributes) {
    /* ghassan to code */

    return attributes;
}

function colorNumberToClass(attributes) {
    if (typeof attributes.colorNumber !== 'undefined') {
        return ` color-${attributes.colorNumber}`;
    }
    return '';
}

export function adaptEntity(thing) {
    let { attributes, type } = thing;

    if (type === 'arc') {
        attributes = arcToPath(attributes);
        type = 'path';
    } else if (type === 'lwpolyline') {
        attributes = verticesToPolyline(attributes, thing.closed);
        type = 'polyline';
    } else if (type === 'mtext') {
        attributes = mtextToText(attributes);
        type = 'text';
    } else {
        attributes = Object.assign({}, attributes);
    }

    attributes.class = colorNumberToClass(attributes);
    attributes['vector-effect'] = 'non-scaling-stroke';

    return Object.assign({}, thing, { attributes, type });
}

export function adaptInsert(insert) {
    return Object.assign({
        xScale: 1,
        yScale: 1,
        rotation: 0
    }, insert);
}
