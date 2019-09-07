import React from 'react';
import { node, func } from 'prop-types';

export const DataContext = React.createContext();
export const AuthContext = React.createContext();

export const DataProvider = ({ children, reducer }) => {
  const [store, dispatch] = React.useReducer(reducer, {});
  console.log('store', store);
  const [state, setState] = React.useState({ isLoaded: false });
  React.useEffect(() => {
    dispatch({ type: '@init' });
    setState({ isLoaded: true });
  }, []);
  return (
    <DataContext.Provider value={{ dispatch, store }}>
      {state.isLoaded ? children : false}
    </DataContext.Provider>
  );
};
DataProvider.propTypes = { children: node, reducer: func };

export const AuthProvider = props => {
  const [login, setLogin] = React.useState(false);
  const [user, setUser] = React.useState(null);
  return (
    <AuthContext.Provider value={{ login, user, setLogin, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = { children: node };

/**
 * use context to get global state
 * @param {string} key optionally
 * if key provided it'll return only property required
 */
export const useDataContext = key => {
  const { store, dispatch } = React.useContext(DataContext);
  return key ? [store[key], dispatch] : [store, dispatch];
};

/**
 * use context to get error and loading state
 * @param {string} key is required
 */
export const useStateDefault = key => {
  const { store, dispatch } = React.useContext(DataContext);
  const { error, loading } = store;
  return [error[key], loading[key], dispatch];
};

/**
 * usePrevious is a method to get tracked previous value of a state or props
 * @param {*} value state to detect the previous value
 */
export function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
