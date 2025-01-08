import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  category: number;
  created_at: string;
  updated_at: string;
  citizen: number;
  images: any[];
  distance: number;
}

const base_url = 'http://10.0.2.2:8001';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2MzQ1Njk0LCJpYXQiOjE3MzYzNDIwOTQsImp0aSI6ImM5OWU5ZGI5Yzk3YzRjMDlhMWQ4ZThhMjhmOTIxZDE3IiwidXNlcl9pZCI6MX0.e876ZA3M2HwnOKllSZz9zKUOneYQ46jTYeeR3_70wyk";
export const useFetchIssues = (latitude: number, longitude: number, radius: number) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIssues = async () => {
  try {
    const response = await fetch(`${base_url}/api/v1/citizens/issues/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const text = await response.text(); // Get the response as text
    console.log('Response text:', text); // Log the raw response

    // Try parsing the JSON if the response is expected to be JSON
    try {
      const data = JSON.parse(text);
      if (response.ok) {
        setIssues(data.results);
      } else {
        Alert.alert('Error', 'Failed to fetch issues.');
      }
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      Alert.alert('Error', 'Invalid response format.');
    }

  } catch (error) {
    console.error('Fetch error:', error);
    Alert.alert('Error', 'An error occurred while fetching issues.');
  } finally {
    setLoading(false);
  }
};


    fetchIssues();
  }, [latitude, longitude, radius]);

  return { issues, loading };
};
