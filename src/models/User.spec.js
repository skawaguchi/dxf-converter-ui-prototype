import t from 'tcomb';

import { User } from './User';
import { Email } from './Email';

import { assertRequiredAttributes, assertStrictAttributes } from '../testUtils';
import { getUser } from '../mockUtils';

describe('User Model', () => {
    describe('Structure', () => {
        const requiredAttributes = {
            displayName: t.String,
            email: Email,
            id: t.String
        };

        assertRequiredAttributes(User, requiredAttributes);

        assertStrictAttributes(User, getUser());
    });
});
