import { View } from 'react-native';
import React from 'react';
import { node } from 'prop-types';
import Snackbar from '../components/snackbar';
import { SnackbarContext } from '../Context';

const Layout = ({ children, ...rest }) => {
  const [message] = React.useContext(SnackbarContext);
  return (
    <View style={{ flex: 1 }} {...rest}>
      <Snackbar message={message} />
      {children}
    </View>
  );
};
Layout.propTypes = { children: node };

export default Layout;
