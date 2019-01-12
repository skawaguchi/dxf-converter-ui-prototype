export const getLayerCheckboxes = (list) =>
    list.map(({ isSelected, name }) => ({
        id: name,
        isSelected,
        label: name,
        value: name
    }));

export const getBlockCheckboxes = (list) =>
    list.map(({
        handle,
        isSelected,
        name
    }) => ({
        id: handle,
        isSelected,
        label: name,
        value: name
    }));
