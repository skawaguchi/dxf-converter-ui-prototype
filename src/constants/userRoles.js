import t from 'tcomb';

export const userRoles = t.enums({
    ADMIN: 'ADMIN',
    READ: 'READ',
    WRITE: 'WRITE'
});
