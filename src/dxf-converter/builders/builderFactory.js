import ArcBuilder from './arc';
import BlockBuilder from './block';
import BlocksBuilder from './blocks';
import CircleBuilder from './circle';
import DebugBuilder from './debug';
import EntitiesBuilder from './entities';
import InsertBuilder from './insert';
import LayerBuilder from './layer';
import LineBuilder from './line';
import LtypeBuilder from './ltype';
import LwPolyLineBuilder from './lwpolyline';
import MTextBuilder from './mtext';
import TableBuilder from './table';
import TablesBuilder from './tables';

const builders = {
    ARC: ArcBuilder,
    BLOCKS: BlocksBuilder,
    BLOCK: BlockBuilder,
    CIRCLE: CircleBuilder,
    DEBUG: DebugBuilder,
    ENTITIES: EntitiesBuilder,
    INSERT: InsertBuilder,
    LAYER: LayerBuilder,
    LINE: LineBuilder,
    LTYPE: LtypeBuilder,
    LWPOLYLINE: LwPolyLineBuilder,
    MTEXT: MTextBuilder,
    TABLE: TableBuilder,
    TABLES: TablesBuilder
};

function fallback(type, useDebug) {
    return useDebug ? new DebugBuilder(type) : null;
}

export function getBuilder(type, fallBackToDebug) {
    const BuilderClass = builders[type];

    return BuilderClass ? new BuilderClass() : fallback(type, fallBackToDebug);
}
