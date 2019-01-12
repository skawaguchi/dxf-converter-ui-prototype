import t from 'tcomb';

import { DXFData } from './DXFData';

import {
    assertRequiredAttributes,
    assertStrictAttributes
} from '../testUtils';

import { getDXFData } from '../mockUtils';

describe('DXF Data Model', () => {
    describe('Structure', () => {
        const requiredAttributes = {
            blocks: t.list(t.Any),
            entities: t.dict(
                t.String,
                t.Any
            ),
            tables: t.dict(t.String, t.Any)
        };

        assertRequiredAttributes(DXFData, requiredAttributes);

        assertStrictAttributes(DXFData, getDXFData());
    });
});
