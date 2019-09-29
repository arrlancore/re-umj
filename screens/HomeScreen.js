import React from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { object } from 'prop-types';
import { Card, Headline } from 'react-native-paper';
import Layout from '../components/layout';
import headerStyle from '../components/headerStyle';

const BgImage = require('../assets/images/bgapp.png');

export default function HomeScreen(props) {
  const menus = [
    {
      title: 'Jadwal',
      onPress: () => props.navigation.navigate('Jadwal')
    },
    {
      title: 'Perkuliahan',
      onPress: () => props.navigation.navigate('Perkuliahan')
    }
  ];
  return (
    <Layout>
      <ScrollView style={styles.container}>
        {menus.map((menu, i) => (
          <Card key={i} style={styles.card} onPress={menu.onPress}>
            <Image source={BgImage} style={styles.backgroundImage} />
            <Card.Content style={styles.cardContet}>
              <Headline style={{ color: '#fff' }}>{menu.title}</Headline>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </Layout>
  );
}

HomeScreen.navigationOptions = headerStyle('Homepage');
HomeScreen.propTypes = { navigation: object };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  },
  card: {
    margin: 4,
    backgroundColor: '#efefef',
    minHeight: 120,
    marginBottom: 8
  },
  cardContet: {
    display: 'flex',
    justifyContent: 'center',
    height: 120,
    width: '100%',
    alignItems: 'center'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
});
