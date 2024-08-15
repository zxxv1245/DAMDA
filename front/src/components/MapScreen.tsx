import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, Modal, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { colors } from '../constants/color';
import { GOOGLE_PLACES_API_KEY } from '@env';

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    try {
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
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
}

const MapScreen: React.FC = () => {
  const [region, setRegion] = useState({
    latitude: 35.205236,
    longitude: 126.811752,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          fetchNearbyMarts(latitude, longitude);
        },
        error => {
          console.log(error);
          fetchNearbyMarts(35.205236, 126.811752); // 오류가 발생하면 기본 위치로 마트를 검색
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };

    initializeMap();
  }, []);

  const fetchNearbyMarts = useCallback(async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=TYPES =['supermarket', 'department_store', 'shopping_mall']&keyword=['롯데마트', '하나로마트', '이마트', '홈플러스']&key=${GOOGLE_PLACES_API_KEY}`
      );
      if (response.data.results) {
        setMarkers(response.data.results);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    setIsModalVisible(true);

    if (marker.photos && marker.photos.length > 0) {
      const photoReference = marker.photos[0].photo_reference;
      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
      setPhotoUrl(url);
    } else {
      setPhotoUrl(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMarker(null);
    setPhotoUrl(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        region={region}
        loadingEnabled={true}
        loadingIndicatorColor={colors.BLUE_250}
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
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.BLUE_250} />
          <Text style={styles.loadingText}>마트를 검색 중입니다...</Text>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.cartText}>스마트 쇼핑 카트를 보유 중이에요!</Text>
            {selectedMarker && (
              <>
                {photoUrl && (
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.modalImage}
                  />
                )}
                <Text style={styles.modalTitle}>{selectedMarker.name}</Text>
                <Text style={styles.modalDescription}>주소: {selectedMarker.vicinity}</Text>
                <Text style={styles.modalRating}>평점: {selectedMarker.rating || 'N/A'}</Text>
                <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                  <Text style={styles.closeButtonText}>닫기</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: colors.BLACK,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.WHITE,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalRating: {
    fontSize: 14,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.BLUE_250,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  cartText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.BLUE_500,
  },
});

export default MapScreen;
