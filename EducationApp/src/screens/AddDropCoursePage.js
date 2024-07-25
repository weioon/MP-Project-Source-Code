import React, { useState, useEffect } from 'react';
import { View, Text, Picker, TouchableOpacity, Alert } from 'react-native';
import { addCourse, dropCourse, getCourses } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/styles';

const AddDropCoursePage = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [message, setMessage] = useState('');
  const [existingCourses, setExistingCourses] = useState([]);

  const courses = [
    'Mobile Programming',
    'Basic Networking',
    'Principle Data Science',
    'Web Engineering',
    'Principle of Finance',
    'Accounting',
    'Mathematic',
    'Database Structure',
    'Software Engineering',
    'Operating Systems',
    'Artificial Intelligence',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'Human-Computer Interaction',
    'Computer Graphics',
    'Data Mining',
    'Embedded Systems',
    'Digital Signal Processing',
    'Distributed Systems'
  ];

  const schedules = [
    'Monday -> 8am - 10pm',
    'Monday -> 10am - 12pm',
    'Monday -> 2pm - 5pm',

    'Tuesday -> 8am - 10am',
    'Tuesday -> 11am - 1pm',
    'Tuesday -> 1pm - 3pm',

    'Wednesday -> 8am - 10am',
    'Wednesday -> 11.30am - 1.30pm',
    'Wednesday -> 2pm - 4pm',

    'Thursday -> 8am - 10am',
    'Thursday -> 10am - 12pm',
    'Thursday -> 3pm - 6pm',

    'Friday -> 9am - 11am',
    'Friday -> 11am - 1pm',
    'Friday -> 1pm - 4pm',
  ];

  useEffect(() => {
    const fetchExistingCourses = async () => {
      const response = await getCourses();
      if (response.success) {
        setExistingCourses(response.data);
      }
    };
    fetchExistingCourses();
  }, []);

  const handleAddCourse = async () => {
    if (selectedCourse && selectedSchedule) {
      const duplicate = existingCourses.some(course => course.name === selectedCourse);
      const scheduleConflict = existingCourses.some(course => course.schedule === selectedSchedule);

      if (duplicate) {
        setMessage('Course already added.');
      } else if (scheduleConflict) {
        setMessage('Schedule conflict with another course.');
      } else {
        const response = await addCourse(selectedCourse, selectedSchedule);
        if (response.success) {
          setMessage('Course added successfully');
          setExistingCourses([...existingCourses, { name: selectedCourse, schedule: selectedSchedule }]);
        } else {
          setMessage('Failed to add course');
        }
      }
    } else {
      Alert.alert('Error', 'Please select both a course and a schedule');
    }
  };

  const handleDropCourse = async () => {
    if (selectedCourse) {
      const response = await dropCourse(selectedCourse);
      if (response.success) {
        setMessage('Course dropped successfully');
        setExistingCourses(existingCourses.filter(course => course.name !== selectedCourse));
      } else {
        setMessage('Failed to drop course');
      }
    } else {
      Alert.alert('Error', 'Please select a course to drop');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add/Drop Course" />
      <Text style={styles.title}>Add/Drop Course</Text>

      <Text style={styles.label}>Select Course</Text>
      <Picker
        selectedValue={selectedCourse}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCourse(itemValue)}
      >
        <Picker.Item label="Select a course..." value="" />
        {courses.map((course, index) => (
          <Picker.Item key={index} label={course} value={course} />
        ))}
      </Picker>

      <Text style={styles.label}>Select Schedule</Text>
      <Picker
        selectedValue={selectedSchedule}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedSchedule(itemValue)}
      >
        <Picker.Item label="Select a schedule..." value="" />
        {schedules.map((schedule, index) => (
          <Picker.Item key={index} label={schedule} value={schedule} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleAddCourse}>
        <Text style={styles.buttonText}>Add Course</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleDropCourse}>
        <Text style={styles.buttonText}>Drop Course</Text>
      </TouchableOpacity>
      {message ? <Text style={{ color: 'green', marginTop: 10 }}>{message}</Text> : null}
      <Footer />
    </View>
  );
};

export default AddDropCoursePage;