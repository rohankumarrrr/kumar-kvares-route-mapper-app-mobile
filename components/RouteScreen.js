import React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RouteScreen({ route }) {
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
    <View onLayout={onLayoutRootView}>
      <ImageBackground
        source={{ uri: route.params.data.snapshot }}
        style={{ width: '100%', height: '100%', backgroundColor: 'red' }}
      />
      <View
        style={[styles.scorebar, { position: 'absolute', marginTop: '5%' }]}>
        <View style={styles.icon}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Text style={styles.distanceText}>
              {parseFloat(route.params.data.distance).toFixed(2) >= (1) ? parseFloat(route.params.data.distance).toFixed(2): Math.floor(parseFloat(route.params.data.distance).toFixed(2) * 1609.34)}
            </Text>
            <Text style={[styles.iconHeader, { marginBottom: 3 }]}> {parseFloat(route.params.data.distance).toFixed(2) >= (1) ?"mi":"m"} </Text>
          </View>
          <Text style={styles.iconHeader}>Distance</Text>
        </View>
        <View style={styles.icon}>
          <Text style={styles.distanceText}>{route.params.data.time}</Text>
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
              {!isNaN(route.params.data.pace) &&
              isFinite(route.params.data.pace)
                ? Math.floor(route.params.data.pace) +
                  ':' +
                  (Math.floor(
                    (route.params.data.pace -
                      Math.floor(route.params.data.pace)) *
                      60
                  ) > 9
                    ? Math.floor(
                        (route.params.data.pace -
                          Math.floor(route.params.data.pace)) *
                          60
                      )
                    : '0' +
                      Math.floor(
                        (route.params.data.pace -
                          Math.floor(route.params.data.pace)) *
                          60
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
    </View>
  );
}

const styles = StyleSheet.create({
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
});
