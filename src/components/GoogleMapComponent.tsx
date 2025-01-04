import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Marker, MapViewProps } from 'react-native-maps';

interface Location {
  id: number;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

interface GoogleMapComponentProps extends Partial<MapViewProps> {
  locations?: Location[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  locations = defaultLocations,
  initialRegion = defaultRegion,
  ...mapProps
}) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
        {...mapProps}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinate}
            title={location.title}
            description={location.description}
          >
            <Image 
              source={require('../assets/location.png')}
              style={styles.markerImage}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const defaultLocations: Location[] = [
  {
    id: 1,
    title: 'Central Park',
    description: 'Famous park in NYC',
    coordinate: {
      latitude: 40.7829,
      longitude: -73.9654,
    },
  },
  {
    id: 2,
    title: 'Times Square',
    description: 'The heart of Manhattan',
    coordinate: {
      latitude: 40.7580,
      longitude: -73.9855,
    },
  },
  {
    id: 3,
    title: 'Empire State Building',
    description: 'Iconic skyscraper',
    coordinate: {
      latitude: 40.7484,
      longitude: -73.9857,
    },
  },
];

const defaultRegion = {
  latitude: 40.7580,
  longitude: -73.9855,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default GoogleMapComponent;