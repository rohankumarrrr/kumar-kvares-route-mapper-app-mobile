import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';
import { getPathLength } from 'geolib';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Stopwatch } from 'react-native-stopwatch-timer';
import DialogInput from 'react-native-dialog-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';

SplashScreen.preventAutoHideAsync();

export default function MapScreen({ navigation }) {
  const [mapJustOpened, setMapJustOpened] = useState(true);
  const [isRunningBoolean, setIsRunningBoolean] = useState(false);
  const [touchableDisplay, setTouchableDisplay] = useState('Start Route');
  const [currentUserLocation, setCurrentUserLocation] = useState();
  const [userLocationHistory, setUserLocationHistory] = useState([]);
  const [showCurrentLocation, setShowCurrentLocation] = useState(true);
  const [startMarkerOpacity, setStartMarkerOpacity] = useState(0.0);
  const [startMarkerTitle, setStartMarkerTitle] = useState('');
  const [endMarkerOpacity, setEndMarkerOpacity] = useState(0.0);
  const [endMarkerTitle, setEndMarkerTitle] = useState('');
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [interactedWithMap, setInteractedWithMap] = useState(false);
  const routeTime = React.useRef();
  const avgPace = React.useRef();
  const travelDistance = React.useRef();
  const windowHeight = Dimensions.get('window').height;

  function initializeMap() {
    setShowCurrentLocation(true);
    setTouchableDisplay('Start Route');
    setUserLocationHistory([]);
    travelDistance.current = 0;
    routeTime.current = '00:00:00';
    avgPace.current = 0;
    setInteractedWithMap(false);
    setIsDialogVisible(false);
    setIsRunningBoolean(false);
    setList();
    setMapJustOpened(true);
    setEndMarkerTitle('');
    setEndMarkerOpacity(0.0);
    setStartMarkerOpacity(0.0);
    setStartMarkerTitle('');
  }

  function onStartRoute() {
    setIsRunningBoolean(true);
    setUserLocationHistory([]);
    travelDistance.current = 0;
    setTouchableDisplay('End Route');
    setStartMarkerTitle('Start');
    setStartMarkerOpacity(1.0);
    setEndMarkerOpacity(0.0);
    setEndMarkerTitle('');
    setShowCurrentLocation(true);
  }

  function onEndRoute() {
    setIsRunningBoolean(false);
    setTouchableDisplay('Save Route');
    setStartMarkerOpacity(1.0);
    setEndMarkerOpacity(1.0);
    setEndMarkerTitle('End');
    setShowCurrentLocation(false);
    _fitToPolyline();
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('hello');
      initializeMap();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  async function storeList(newvalue) {
    // On User Saves Route
    try {
      const jsonValue = JSON.stringify(newvalue);
      await AsyncStorage.setItem('savedRoutes', jsonValue);
    } catch (err) {
      console.error(err);
    }
  }

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
      }
    } catch (err) {
      console.error(err);
    }
  }

  const mapStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#263c3f',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#6b9a76',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#38414e',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#212a37',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9ca5b3',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#1f2835',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#f3d19c',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2f3948',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#515c6d',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
  ];

  const _mapView = React.createRef();

  function _animateToUserPosition(coordinate) {
    if (_mapView.current) {
      _mapView.current.animateToRegion(
        {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: isRunningBoolean ? 0.001 : 0.01,
          longitudeDelta: isRunningBoolean ? 0.001 : 0.01,
        },
        500
      );
    }
  }

  function _fitToPolyline() {
    if (_mapView.current) {
      _mapView.current.fitToCoordinates(userLocationHistory, {
        edgePadding: {
          top: 200,
          bottom: 175,
          left: 50,
          right: 50,
        },
        animated: true,
      });
    }
  }

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

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={showCurrentLocation}
        pitchEnabled={true}
        rotateEnabled={true}
        zoomEnabled={showCurrentLocation}
        scrollEnabled={showCurrentLocation}
        ref={_mapView}
        onLongPress={(event) => {
          if (isRunningBoolean) {
            setInteractedWithMap(true);
          }
        }}
        onPress={(event) => {
          if (isRunningBoolean) {
            setInteractedWithMap(true);
          }
        }}
        onPanDrag={(event) => {
          if (isRunningBoolean) {
            setInteractedWithMap(true);
          }
        }}
        onUserLocationChange={(userPosition) => {
          setCurrentUserLocation(userPosition.nativeEvent.coordinate);
          if (mapJustOpened) {
            _animateToUserPosition(userPosition.nativeEvent.coordinate);
            setMapJustOpened(false);
          }
          if (isRunningBoolean) {
            if (!interactedWithMap) {
              console.log('this is working');
              _animateToUserPosition(userPosition.nativeEvent.coordinate);
            }
            let tempArray = [...userLocationHistory];
            tempArray.push(userPosition.nativeEvent.coordinate);
            setUserLocationHistory(tempArray);
            travelDistance.current = getPathLength(tempArray) * 0.00062137;
          }
        }}
        customMapStyle={mapStyle}>
        <Marker
          title={startMarkerTitle}
          pinColor="red"
          coordinate={userLocationHistory[0]}
          opacity={startMarkerOpacity}
          identifier="start"
        />
        <Marker
          title={endMarkerTitle}
          pinColor="blue"
          coordinate={userLocationHistory[userLocationHistory.length - 1]}
          opacity={endMarkerOpacity}
          identifier="end"
        />
        <Polyline
          strokeColor={'red'}
          strokeWidth={6}
          coordinates={userLocationHistory}
        />
      </MapView>
      <DialogInput
        isDialogVisible={isDialogVisible}
        title={'Enter Route Name'}
        hintInput={
          'New Run ' +
          new Date().toJSON().substring(0, new Date().toJSON().indexOf('T'))
        }
        submitInput={(textInput) => {
          captureRef(_mapView.current, {
            format: 'jpg',
          }).then(
            (uri) => {
              let tempArray = [...savedRoutes];
              tempArray.push({
                name: textInput,
                date: new Date().toJSON(),
                pace: avgPace.current,
                distance: travelDistance.current,
                time: routeTime.current,
                snapshot: uri,
                id: 0,
              });

              for (var i = 0; i < tempArray.length; i++) {
                tempArray[i].id = i;
              }

              storeList(tempArray);
              setSavedRoutes(tempArray);
              setIsDialogVisible(false);
              navigation.navigate('Welcome');
            },
            (error) => console.error('Oops, snapshot failed', error)
          );
        }}
        closeDialog={() => {
          setIsDialogVisible(false);
        }}
      />
      <View style={styles.scorebar}>
        <View style={styles.icon}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Text style={styles.distanceText}>
              {parseFloat(travelDistance.current).toFixed(2) >= (1) ? parseFloat(travelDistance.current).toFixed(2) : Math.floor(parseFloat(travelDistance.current).toFixed(2) * 1609.34)}
            </Text>
            <Text style={[styles.iconHeader, { marginBottom: 3 }]}> {parseFloat(travelDistance.current).toFixed(2) >= (1) ? "mi" : "m"} </Text>
          </View>
          <Text style={styles.iconHeader}>Distance</Text>
        </View>
        <View style={styles.icon}>
          <Stopwatch
            options={stopwatchStyle}
            start={isRunningBoolean}
            getTime={(time) => {
              routeTime.current = time;
              avgPace.current =
                (parseInt(time.substring(6)) +
                  parseInt(time.substring(3, 5)) * 60 +
                  parseInt(time.substring(0, 2)) * 3600) /
                travelDistance.current /
                60;
            }}
          />
          <Text style={styles.iconHeader}>Time</Text>
        </View>
        <View style={[styles.icon, { borderRightWidth: 0 }]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Text style={styles.distanceText}>
              {!isNaN(avgPace.current) && isFinite(avgPace.current)
                ? Math.floor(avgPace.current) +
                  ':' +
                  (Math.floor(
                    (avgPace.current - Math.floor(avgPace.current)) * 60
                  ) > 9
                    ? Math.floor(
                        (avgPace.current - Math.floor(avgPace.current)) * 60
                      )
                    : '0' +
                      Math.floor(
                        (avgPace.current - Math.floor(avgPace.current)) * 60
                      ))
                : '00:00'}
            </Text>
            <Text style={[styles.iconHeader, { marginBottom: 3 }]}>
              {' '}
              min/mi
            </Text>
          </View>
          <Text style={styles.iconHeader}>Avg. Pace</Text>
        </View>
      </View>
      <View
        style={{
          height: '7.5%',
          width: '100%',
          marginBottom: '10%',
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'absolute',
          top: windowHeight * 0.775,
        }}>
        <TouchableOpacity
          onPress={() => {
            touchableDisplay == 'Start Route'
              ? onStartRoute()
              : touchableDisplay == 'End Route'
              ? onEndRoute()
              : setIsDialogVisible(true);
          }}
          style={[
            styles.routeButton,
            {
              borderColor: 'white',
              height: '100%',
              borderWidth: 1,
              backgroundColor:
                touchableDisplay == 'End Route'
                  ? 'red'
                  : touchableDisplay == 'Start Route'
                  ? '#66c992'
                  : '#00B9FB',
            },
          ]}>
          <Text style={[styles.distanceText, { fontFamily: 'madetommy' }]}>
            {touchableDisplay}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.locationFocus,
            { opacity: showCurrentLocation ? 1 : 0.5 },
          ]}
          onPress={() => {
            _animateToUserPosition(currentUserLocation);
            if (isRunningBoolean) {
              setInteractedWithMap(false);
            }
          }}
          disabled={!showCurrentLocation}>
          <Image
            source={require('./assets/newtarget.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#18191A',
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  routeButton: {
    height: '6.1%',
    width: '80%',
    justifyContent: 'center',
    borderRadius: 35,
    marginLeft: '2%',
    marginBottom: '20%',
  },
  distanceText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  iconHeader: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    fontFamily: 'madetommy',
  },
  scorebar: {
    flexDirection: 'row',
    backgroundColor: '#3a3b3c',
    height: '10%',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: '5%',
  },
  icon: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '33%',
    height: '100%',
    borderRightColor: 'gray',
    borderRightWidth: 1,
  },
  locationFocus: {
    backgroundColor: '#d4d4d4',
    width: '14%',
    height: '100%',
    marginHorizontal: '2%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
    padding: 12,
  },
});

const stopwatchStyle = {
  container: {
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    color: '#FFF',
  },
};
