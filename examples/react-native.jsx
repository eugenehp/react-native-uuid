/**
 * React Native UUID Examples
 *
 * This file demonstrates how to use react-native-uuid in a React Native application
 */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import uuid from 'react-native-uuid';

/**
 * Example 1: Generate UUIDs on button press
 */
export function GenerateUUIDExample() {
  const [generatedUUID, setGeneratedUUID] = useState(null);

  const handleGenerateUUID = () => {
    const newUUID = uuid.v4();
    setGeneratedUUID(newUUID);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleGenerateUUID}>
        <Text style={styles.buttonText}>Generate UUID</Text>
      </TouchableOpacity>
      {generatedUUID && <Text style={styles.uuidText}>{generatedUUID}</Text>}
    </View>
  );
}

/**
 * Example 2: Creating unique IDs for list items
 */
export function TodoListExample() {
  const [todos, setTodos] = useState([]);

  const addTodo = title => {
    const newTodo = {
      id: uuid.v4(),
      title,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  return (
    <View>
      {todos.map(todo => (
        <View key={todo.id} style={styles.todoItem}>
          <Text>
            {todo.title} - {todo.id}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Example 3: Generating deterministic IDs from user data
 */
export function DeterministicIDExample() {
  const generateUserID = userName => {
    // v5 creates the same UUID for the same input
    return uuid.v5(userName, uuid.DNS);
  };

  const user1ID = generateUserID('john@example.com');
  const user2ID = generateUserID('jane@example.com');

  return (
    <View style={styles.container}>
      <Text>User ID for john@example.com: {user1ID}</Text>
      <Text>User ID for jane@example.com: {user2ID}</Text>
    </View>
  );
}

/**
 * Example 4: Using custom RNG for v4 UUIDs (if needed)
 */
export function CustomRNGExample() {
  // For most cases, the default RNG is sufficient
  // But if you need cryptographically secure random numbers:

  const generateSecureV4 = async () => {
    // In React Native, you can use react-native-get-random-values
    // or another cryptographic library
    // Example with a custom RNG:

    const customRNG = () => {
      // Return 16 random bytes (0-255)
      return Array.from({length: 16}, () => Math.floor(Math.random() * 256));
    };

    return uuid.v4({rng: customRNG});
  };

  return (
    <View>
      <Text>Custom RNG v4 UUID: {generateSecureV4()}</Text>
    </View>
  );
}

/**
 * Example 5: Validating UUID input
 */
export function ValidateUUIDExample() {
  const [inputUUID, setInputUUID] = useState('');
  const [isValid, setIsValid] = useState(null);

  const handleValidate = () => {
    const valid = uuid.validate(inputUUID);
    setIsValid(valid);
  };

  return (
    <View style={styles.container}>
      <Text>Enter a UUID to validate</Text>
      {isValid !== null && (
        <Text style={{color: isValid ? 'green' : 'red'}}>
          {isValid ? 'Valid UUID' : 'Invalid UUID'}
        </Text>
      )}
    </View>
  );
}

/**
 * Example 6: Tracking objects by UUID
 */
export class ObjectTracker {
  constructor() {
    this.objects = new Map();
  }

  createObject(data) {
    const id = uuid.v4();
    this.objects.set(id, {
      id,
      data,
      createdAt: new Date(),
    });
    return id;
  }

  getObject(id) {
    if (!uuid.validate(id)) {
      throw new Error(`Invalid UUID: ${id}`);
    }
    return this.objects.get(id);
  }

  deleteObject(id) {
    return this.objects.delete(id);
  }

  getAllObjects() {
    return Array.from(this.objects.values());
  }
}

// Example usage
export function ObjectTrackerExample() {
  const tracker = new ObjectTracker();

  const id1 = tracker.createObject({name: 'Item 1'});
  const id2 = tracker.createObject({name: 'Item 2'});

  const objects = tracker.getAllObjects();

  return (
    <View>
      {objects.map(obj => (
        <View key={obj.id}>
          <Text>
            {obj.data.name}: {obj.id}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uuidText: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    fontFamily: 'Courier New',
    fontSize: 12,
  },
  todoItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});
