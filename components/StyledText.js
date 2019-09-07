import React from 'react';
import { Text } from 'react-native';
import { object } from 'prop-types';

export function MonoText(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />
  );
}
MonoText.propTypes = { style: object };
