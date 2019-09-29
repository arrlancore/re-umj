import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage } from 'react-native';
import { List } from 'react-native-paper';
import headerStyle from '../components/headerStyle';
import Layout from '../components/layout';
import { usePrevious } from '../Context';

export default function JadwalScreen({ navigation }) {
  const [jadwal, setJadwal] = React.useState(null);
  const [jadwalToday, setJadwalToday] = React.useState([]);
  const [expanded, setExpanded] = React.useState('');
  const prevJadwal = usePrevious(jadwal);

  async function getJadwal() {
    const jadwalData = await AsyncStorage.getItem('jadwal');
    return JSON.parse(jadwalData);
  }

  const handlePress = key => {
    if (key === expanded) {
      return setExpanded('');
    }
    setExpanded(key);
  };

  const handleItemPress = jadwalData =>
    navigation.navigate({
      routeName: 'JadwalDetail',
      params: jadwalData
    });

  const findJadwalToday = jadwal => {
    const early = new Date().setHours(0, 0, 0);
    const late = new Date().setHours(23, 59, 59);
    const todaySchedule = jadwal.filter(data => {
      const jadwalDate = new Date(data.tanggal).getTime();
      return jadwalDate >= early && jadwalDate <= late;
    });
    setJadwalToday(todaySchedule);
  };

  const handleJadwal = data => {
    const indexJadwal = {};
    for (let i = 0; i < data.length; i++) {
      let jadwalKuliah = data[i];
      indexJadwal[jadwalKuliah.mataKuliah.namaMataKuliah] =
        jadwalKuliah.mataKuliah._id;
    }
    let jadwalCategorized = [];
    Object.keys(indexJadwal).forEach(key => {
      let temp = [];
      data.forEach(jadwal => {
        if (key === jadwal.mataKuliah.namaMataKuliah) {
          temp.push(jadwal);
        }
      });
      jadwalCategorized.push(temp);
    });
    setJadwal(jadwalCategorized);
  };

  React.useEffect(() => {
    if (!jadwal && prevJadwal !== jadwal) {
      getJadwal().then(data => {
        handleJadwal(data);
        findJadwalToday(data);
      });
    }
  });
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <List.Section title="Hari ini">
          {jadwalToday[0] ? (
            jadwalToday.map((jadwalData, keyJadwal) => {
              return (
                <List.Item
                  key={keyJadwal}
                  onPress={() => handleItemPress(jadwalData)}
                  titleStyle={
                    new Date(jadwalData.tanggal).getTime() < Date.now() &&
                    styles.pastItem
                  }
                  description={jadwalData.mataKuliah.namaMataKuliah}
                  title={`Pertemuan ${jadwalData.pertemuan}: ${new Date(
                    jadwalData.tanggal
                  ).toLocaleDateString()} ${jadwalData.waktuMulai}`}
                />
              );
            })
          ) : (
            <List.Item
              titleStyle={styles.pastItem}
              title="Tidak ada jadwal hari ini"
            />
          )}
        </List.Section>

        <List.Section title="Mata Kuliah">
          {jadwal &&
            jadwal.map((data, key) => (
              <List.Accordion
                key={key}
                title={data[0].mataKuliah.namaMataKuliah.toUpperCase()}
                left={props => <List.Icon {...props} icon="folder" />}
                expanded={expanded === key}
                onPress={() => handlePress(key)}
              >
                {data &&
                  data.map((jadwalData, keyJadwal) => {
                    return (
                      <List.Item
                        key={keyJadwal}
                        onPress={() => handleItemPress(jadwalData)}
                        titleStyle={
                          new Date(jadwalData.tanggal).getTime() < Date.now() &&
                          styles.pastItem
                        }
                        title={`Pertemuan ${jadwalData.pertemuan}: ${new Date(
                          jadwalData.tanggal
                        ).toLocaleDateString()} ${jadwalData.waktuMulai}`}
                      />
                    );
                  })}
              </List.Accordion>
            ))}
        </List.Section>
      </ScrollView>
    </Layout>
  );
}

JadwalScreen.navigationOptions = headerStyle('Jadwal');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  },
  card: {
    margin: 4,
    backgroundColor: '#efefef',
    minHeight: 120
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
  },
  pastItem: {
    color: '#999'
  }
});
