import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { object } from 'prop-types';

export default function SettingsScreen(props) {
  const { navigate } = props.navigation;
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */

  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      {/* <ExpoLinksView /> */}
      <Text onPress={() => navigate('LinksPage')}>Hello Click Me</Text>
    </ScrollView>
  );
}
SettingsScreen.propTypes = { navigation: object };
SettingsScreen.navigationOptions = {
  title: 'app.json'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  }
});
