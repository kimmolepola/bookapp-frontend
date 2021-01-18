import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';

import { ApolloClient } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

// import { split } from 'apollo-link';
// import { WebSocketLink } from 'apollo-link-ws';
// simport { getMainDefinition } from 'apollo-utilities';
import App from './App';

require('dotenv').config();

/*
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_BACKEND_WS,
  options: { reconnect: true },
});
*/

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_HTTP,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('book-app-user-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  };
});

/*
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);
*/

const link = authLink.concat(httpLink);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));
