import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFetchIssues } from '../fetch/fetchIssues';

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string; // 'location' is already an object, no need for JSON.parse
  status: string;
  category: number;
  created_at: string;
  updated_at: string;
  citizen: number;
  images: any[];
  distance: number;
}

interface GoogleMapComponentProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  locations?: Issue[];
  [key: string]: any; // For additional MapView props
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  initialRegion,
  ...mapProps
}) => {
  const { issues, loading } = useFetchIssues(57.476338, -2.9183526, 20000);

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  console.log(issues);

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
        {issues.map((issue) => {
          let lat, lng;
          try {
            const locationString = issue.location.replace(/'/g, '"');
            const locationObj = JSON.parse(locationString);
            lat = locationObj.lat;
            lng = locationObj.lng;
          } catch (error) {
            console.error('Error parsing location:', error);
            return null; // Skip this marker if parsing fails
          }
          
          return (
            <Marker
              key={issue.id}
              coordinate={{
                latitude: lat,
                longitude: lng
              }}
            >
              <Image
                source={require('../assets/location.png')}
                style={styles.markerImage}
              />
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 40,
    height: 40,
  },
});

export default GoogleMapComponent;
