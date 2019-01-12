import t from 'tcomb';

import { DXFFile } from './DXFFile';

import { assertRequiredAttributes, assertStrictAttributes } from '../testUtils';
import { getDXFFile } from '../mockUtils';

describe('DXF File Model', () => {
    describe('Structure', () => {
        const requiredAttributes = {
            lastModified: t.Number,
            lastModifiedDate: t.Date,
            name: t.String,
            size: t.Number,
            title: t.String
        };

        assertRequiredAttributes(DXFFile, requiredAttributes);

        assertStrictAttributes(DXFFile, getDXFFile());
    });
});
