import t from 'tcomb';

import { UserRole } from './UserRole';

import { assertRequiredAttributes, assertStrictAttributes } from '../testUtils';
import { getUserRole } from '../mockUtils';

describe('UserRole Model', () => {
    describe('Structure', () => {
        const requiredAttributes = {
            role: t.enums,
            userID: t.String
        };

        assertRequiredAttributes(UserRole, requiredAttributes);

        assertStrictAttributes(UserRole, getUserRole());
    });
});
