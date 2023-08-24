import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen({ navigation }) {
  const [savedRoutes, setSavedRoutes] = useState([]);

  async function setList() {
    // On User Opens App
    try {
      const value = await AsyncStorage.getItem('savedRoutes');
      if (
        value !== null &&
        value !== 'undefined' &&
        JSON.parse(value).length !== 0
      ) {
        setSavedRoutes(JSON.parse(value));
      } else {
        setSavedRoutes([]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function storeList(newvalue) {
    // On User Saves Route
    try {
      const jsonValue = JSON.stringify(newvalue);
      await AsyncStorage.setItem('savedRoutes', jsonValue);
    } catch (err) {
      console.error(err);
    }
  }

  function removeFromList(id) {
    let tempArray = [...savedRoutes];
    tempArray.splice(id, 1);
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i].id = i;
    }
    setSavedRoutes(tempArray);
    storeList(tempArray);
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setList();
      const getPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('nah');
          return;
        }
      };
      getPermission();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const [fontsLoaded] = useFonts({
    madetommy: require('./assets/madetommy.otf'),
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const windowWidth = Dimensions.get('window').width;

  const Item = ({ id }) => (
    <View
      style={{
        flexDirection: 'row',
        width: windowWidth * 0.9,
        marginLeft: '5%',
        justifyContent: 'flex-end',
      }}>
      <TouchableOpacity
        style={[styles.newProject, { flex: 1 }]}
        onPress={() => {
          console.log(savedRoutes[id]);
          navigation.navigate('Route', {
            data: savedRoutes[id],
          });
        }}>
        <View style={[styles.imagePreview, { height: '100%' }]}>
          <ImageBackground
            source={{ uri: savedRoutes[id].snapshot }}
            style={{ width: '100%', height: '100%' }}
            imageStyle={{ borderRadius: 10 }}
          />
        </View>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '5%',
            flexDirection: 'column',
          }}>
          <Text style={[styles.projectName, { alignSelf: 'flex-start' }]}>
            {savedRoutes[id].name}
          </Text>
          <Text style={styles.subtext}>
            {savedRoutes[id].date.substring(
              0,
              savedRoutes[id].date.indexOf('T')
            )}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          removeFromList(id);
        }}>
        <Image
          source={require('./assets/newtrashcan.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );

  const renderItem = (
    { item } // Rendering Item for Flat List
  ) => <Item id={item.id} />;

  return (
    <SafeAreaView
      style={[styles.container, { alignItems: 'flex-start' }]}
      onLayout={onLayoutRootView}>
      <Text
        style={[
          styles.projectList,
          {
            width: '90%',
            alignSelf: 'center',
            marginTop: '10%',
            marginBottom: '5%',
          },
        ]}>
        Routes
      </Text>
      <TouchableOpacity
        style={[
          styles.newProject,
          { marginBottom: '5%', width: windowWidth * 0.9, marginLeft: '5%' },
        ]}
        onPress={() => {
          navigation.navigate('Map');
        }}>
        <View style={styles.imagePreview}>
          <Text
            style={{
              fontSize: 90,
              textAlign: 'center',
              fontFamily: 'madetommy',
              justifyContent: 'center',
              width: '100%',
              bottom: 9,
              color: 'white',
            }}>
            +
          </Text>
        </View>
        <Text style={[styles.projectName, { paddingLeft: '5%' }]}>
          New Route
        </Text>
      </TouchableOpacity>
      <FlatList
        data={savedRoutes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ width: '100%', height: '100%' }}
      />
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#18191A',
  },
  newProject: {
    backgroundColor: '#3a3b3c',
    width: '90%',
    height: windowWidth * 0.3,
    paddingVertical: '3%',
    alignSelf: 'flex-start',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: '5%',
    borderColor: 'white',
    textAlign: 'left',
  },
  imagePreview: {
    borderWidth: 1,
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    marginLeft: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: 'white',
  },
  projectName: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'madetommy',
    alignSelf: 'center',
  },
  removeButton: {
    width: '15%',
    height: '36.25%',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 1,
    position: 'absolute',
    right: '5%',
    top: '26%',
  },
  projectList: {
    fontSize: 50,
    color: 'white',
    fontFamily: 'madetommy',
  },
  subtext: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'madetommy',
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
});
