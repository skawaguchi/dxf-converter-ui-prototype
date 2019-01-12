import t from 'tcomb';

export const UserRole = t.struct({
    role: t.enums,
    userID: t.String
}, {
    strict: true
});
