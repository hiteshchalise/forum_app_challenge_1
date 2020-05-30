import store from '../store';
import { userCreator, userDestroyer } from '../user/auth';

describe('it tests auth', () => {

    let auth;
    beforeEach(() => {
        auth = {
            id: "123",
            name: "hitesh",
            email: "hitesh@gmail.com",
            token: "123token123"
        }
    });

    it('it adds user to the store', () => {

        store.dispatch(userCreator(auth));

        expect(store.getState().user.auth).toEqual(auth);
    });

    it('it removes user to the store', () => {
        // Arrange
        store.dispatch(userCreator(auth));

        // Act
        store.dispatch(userDestroyer());

        // Assert
        expect(store.getState().user.auth).toEqual({});
    });
})