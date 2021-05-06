import { Provider } from 'react-redux';
import store from './Store';
import React from 'react';
import App from '../components/App';

export default class ReduxProvider extends React.Component {
    render() {
        return (
            <Provider store={ store }>
                <App store={ this.store } />
            </Provider>
        );
    }
}