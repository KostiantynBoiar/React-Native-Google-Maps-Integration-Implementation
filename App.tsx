import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import GoogleMapComponent from './src/components/GoogleMapComponent';


const App = () => {

  return (
    <GoogleMapComponent/>
  );
};

export default App;