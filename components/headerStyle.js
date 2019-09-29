import React from 'react';
import Logout from './logoutButton';

const headerProtectedStyle = title => ({
  title: title,
  headerStyle: {
    backgroundColor: '#b31e6f'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    color: '#fff'
  },
  headerRight: <Logout />
});

export default headerProtectedStyle;
