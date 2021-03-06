import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';

// dev-392fcior.us.auth0.com - client domain
// Vt5RW2r6a4afbFtnSJtzMu2bx8P5OI9c -client id

ReactDOM.render(
  // <React.StrictMode
  //   domain="dev-392fcior.us.auth0.com"
  //   clientId="Vt5RW2r6a4afbFtnSJtzMu2bx8P5OI9c"
  //   redirectUri={window.location.origin}
  // >
    <Auth0Provider>
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
