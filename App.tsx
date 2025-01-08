import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import GoogleMapComponent from './src/components/GoogleMapComponent';


const App = () => {
  const initialRegion = {
    latitude: 56.476338,
    longitude: -2.9183526,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <GoogleMapComponent initialRegion={initialRegion} />
  );
};

export default App;