import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { string, bool } from 'prop-types';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
TabBarIcon.propTypes = {
  name: string,
  focused: bool
};
