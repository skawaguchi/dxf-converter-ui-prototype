import t from 'tcomb';

import { Email } from './Email';

export const User = t.struct({
    displayName: t.String,
    email: Email,
    id: t.String
}, {
    strict: true
});
