import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import store from './store/index';
import { router } from './router';

function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;
