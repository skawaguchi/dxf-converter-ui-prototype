import t from 'tcomb';

export const DXFOutput = t.struct({
    blocks: t.list(t.Any),
    entities: t.dict(
        t.String,
        t.Any
    ),
    tables: t.dict(t.String, t.Any)
}, {
    strict: true
});
