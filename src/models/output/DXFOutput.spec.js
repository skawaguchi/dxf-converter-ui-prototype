import t from 'tcomb';

import { DXFOutput } from './DXFOutput';

import { assertRequiredAttributes, assertStrictAttributes } from '../../testUtils';
import { getDXFOutput } from '../../mockUtils';

describe('DXF File Model', () => {
    describe('Structure', () => {
        const requiredAttributes = {
            blocks: t.list(t.Any),
            entities: t.dict(
                t.String,
                t.Any
            ),
            tables: t.dict(t.String, t.Any)
        };

        assertRequiredAttributes(DXFOutput, requiredAttributes);

        assertStrictAttributes(DXFOutput, getDXFOutput());
    });
});
