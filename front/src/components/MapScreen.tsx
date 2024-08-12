import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { colors } from '../constants/color';


async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    }
  } catch (err) {
  }
}

const MapScreen: React.FC = () => {
  const [region, setRegion] = useState({
    latitude: 35.205236,
    longitude: 126.811752,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    requestLocationPermission();

    // 현재 위치를 가져와 설정하는 부분
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        fetchNearbyMarts(latitude, longitude); // 현재 위치로 근처 마트를 검색
      },
      error => {
        fetchNearbyMarts(35.205236, 126.811752);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, [markers]);

  const fetchNearbyMarts = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=TYPES =['supermarket', 'department_store', 'shopping_mall']&keyword=['롯데마트', '하나로마트', '이마트', '홈플러스']&key=AIzaSyD9c-ic01zBgyq5SscE5bKnbZIgdZ-SOus`
      );
      if (response.data.results) {
        setMarkers(response.data.results);
      }
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        region={region}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.geometry.location.lat,
              longitude: marker.geometry.location.lng,
            }}
            title={marker.name}
            description={marker.vicinity}
            pinColor={colors.BLUE_200}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
