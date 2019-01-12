import * as d3 from 'd3';

import { adaptEntity, adaptInsert } from './svg-adapter';

function filterOutNonInserts(entity) {
    return entity.type !== 'insert';
}

function render(container, thing) {
    const instance = container.append(thing.type);

    Object.keys(thing.attributes).forEach((attr) => {
        instance.attr(attr, thing.attributes[attr]);
    });

    return instance;
}

export function renderDxfIntoSVG(dxf, svg) {
    if (!dxf) {
        return;
    }

    svg.selectAll('*').remove();

    const dxfBlocks = dxf.blocks.reduce((blockAccumulator, block) => {
        blockAccumulator[block.name] = {
            attributes: {},
            entities: block.entities
                .filter(filterOutNonInserts)
                .map(adaptEntity),
            type: 'g',
            x: block.x,
            y: block.y
        };

        return blockAccumulator;
    }, {});

    const entitiesContainerGroup = svg.append('g')
        .attr('title', 'Entities')
        .attr('id', 'entity-container');

    const blockContainerGroup = svg.append('g')
        .attr('title', 'Blocks')
        .attr('id', 'block-container');

    dxf.entities.entities
        .map(adaptEntity)
        .forEach((entity) => {
            render(entitiesContainerGroup, entity)
                .attr('id', `handle-${entity.handle}`);
        });

    dxf.entities.insertions
        .map(adaptInsert)
        .forEach((insert) => {
            let containingGroup = blockContainerGroup;
            const block = dxfBlocks[insert.blockName];

            if (insert.extrusionZ === -1) {
                containingGroup = blockContainerGroup.append('g');
                containingGroup.attr('transform', 'scale(-1, 1)');
            }

            const blockGroup = render(containingGroup, block);

            const centerX = block.x + insert.x;
            const centerY = block.y + insert.y;
            const scale = `scale(${insert.xScale}, ${insert.yScale})`;
            const rotate = `rotate(${insert.rotation}, ${centerX}, ${centerY})`;
            const translate = `translate(${centerX}, ${centerY})`;

            blockGroup.attr('id', `handle-${insert.handle}`);
            blockGroup.attr('transform', `${rotate}, ${translate}, ${scale}`);
            blockGroup.attr('title', insert.blockName);
            blockGroup.enter();

            block.entities.forEach((entity) => {
                render(blockGroup, entity)
                    .attr('id', `handle-${insert.handle}-${entity.handle}`);
            });
        });
}

export function initializeSVG(elementId) {
    const svg = d3
        .select(document.getElementById(elementId))
        .attr('width', '100%');

    svg
        .append('g')
        .attr('id', 'main-container')
        .attr('title', 'Main Container');

    return svg;
}

export function resizeSVG(svg) {
    const mainBoundingBox = svg.select('#main-container').node().getBBox();
    const padding = 20;
    const x = mainBoundingBox.x - padding;
    const y = mainBoundingBox.y - padding;
    const width = mainBoundingBox.width + (padding * 2);
    const height = mainBoundingBox.height + (padding * 2);


    svg.attr('viewBox', `${x} ${y} ${width} ${height}`);

    const flip = 'scale(1, -1)';

    svg.attr('transform', `${flip}`);
}
