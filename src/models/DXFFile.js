import t from 'tcomb';

export const DXFFile = t.struct({
    lastModified: t.Number,
    lastModifiedDate: t.Date,
    name: t.String,
    size: t.Number,
    title: t.String
}, {
    strict: true
});
