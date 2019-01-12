import { makeStore } from './storeFactory';
import { UIStore } from './UIStore';

describe('store factory', () => {
    it('should create a ui store', () => {
        const store = makeStore();

        expect(store.ui instanceof UIStore).toEqual(true);
    });
});
