import { UIStore } from './UIStore';

export function makeStore() {
    return {
        ui: new UIStore()
    };
}
