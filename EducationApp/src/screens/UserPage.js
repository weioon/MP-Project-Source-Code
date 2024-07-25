import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { updateUser, getUser } from '../services/api';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/styles';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUser(userId);
      if (response.success) {
        setUser(response.data);
        setContactNumber(response.data.contactNumber || '');
        setAddress(response.data.address || '');
        setBio(response.data.bio || '');
      } else {
        setError(response.message || 'Failed to fetch user');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const handleUpdate = async () => {
    const response = await updateUser(userId, user.name, user.email, contactNumber, address, bio);
    if (response.success) {
      // Optionally, you can update the user state here if needed
      // setUser({ ...user, contactNumber, address, bio });
      alert('Profile updated successfully');
    } else {
      alert('Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="User Profile" />
      <Text style={styles.title}>User Profile</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading user information...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.profileContainer}>
          <Text style={styles.profileText}>Name: {user.name}</Text>
          <Text style={styles.profileText}>Email: {user.email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Bio"
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      <Footer />
    </View>
  );
};

export default UserPage;