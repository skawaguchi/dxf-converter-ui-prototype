import { getBuilder } from './builderFactory';

function appendChild(entities, child) {
    if (!child) {
        return;
    }

    if (child.type === 'insert') {
        entities.insertions.push(child);
    } else {
        entities.entities.push(child);
    }
}

function startOfSomethingNew(group) {
    return group.code === 0;
}

export default class EntitiesBuilder {
    constructor() {
        this.entities = {
            entities: [],
            insertions: []
        };
        this.builder = null;
    }

    addGroup(group) {
        if (startOfSomethingNew(group)) {
            if (this.builder) {
                appendChild(this.entities, this.builder.getResult());
            }

            this.builder = getBuilder(group.value, true);
        } else if (this.builder) {
            this.builder.addGroup(group);
        }
    }

    getResult() {
        if (this.builder) {
            appendChild(this.entities, this.builder.getResult());
        }
        return this.entities;
    }
}
