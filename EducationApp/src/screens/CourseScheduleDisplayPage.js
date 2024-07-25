import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getCourses } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/styles';

const CourseScheduleDisplayPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        if (response.success) {
          setCourses(response.data);
          setFilteredCourses(response.data); // Initialize filteredCourses with all courses
        } else {
          setError('Failed to load courses.');
        }
      } catch (err) {
        setError('An error occurred while fetching courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = () => {
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleReset = () => {
    setFilteredCourses(courses);
    setSearchQuery('');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingText} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (filteredCourses.length === 0) {
    return <Text style={styles.emptyText}>No courses available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Header title="Course Schedule" />
      <Text style={styles.title}>Course Schedule</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search course..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.flex1]}>Course Name</Text>
        <Text style={[styles.tableHeaderText, styles.flex1]}>Time</Text>
      </View>
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text style={[styles.courseText, styles.flex1]}>{item.name}</Text>
            <Text style={[styles.courseText, styles.flex1]}>{item.schedule}</Text>
          </View>
        )}
      />
      <Footer />
    </View>
  );
};

export default CourseScheduleDisplayPage;
