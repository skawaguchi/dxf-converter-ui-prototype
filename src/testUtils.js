function getAttributeMeta(model, attribute) {
    return model.meta.props[attribute].meta;
}

function assertType(model, attribute, expectedType) {
    const meta = getAttributeMeta(model, attribute);

    expect(meta).toEqual(expectedType.meta);
}

export function assertOptionalType(model, attribute, expectedType) {
    const meta = getAttributeMeta(model, attribute);

    expect(meta.kind).toEqual('maybe');
    expect(meta.type.meta).toEqual(expectedType.meta);
}

const descriptionMap = {
    OPTIONAL: 'an optional value',
    REQUIRED: 'a required value'
};

function assertAttributes(type, model, map) {
    const typeDescription = descriptionMap[type];

    Object.keys(map)
        .forEach((attribute) => {
            it(`should have ${typeDescription} for ${attribute}`, () => {
                assertType(model, attribute, map[attribute]);
            });
        });
}

export function assertRequiredAttributes(model, map) {
    assertAttributes('REQUIRED', model, map);
}

export function assertOptionalAttributes(model, map) {
    assertAttributes('OPTIONAL', model, map);
}

export function assertStrictAttributes(Struct, validModel) {
    it('should not accept extra attributes', () => {
        const testStruct = () => {
            Struct({
                ...validModel,
                someObviouslyRandomAttribute: 'some value'
            });
        };

        expect(testStruct).toThrow();
    });
}
