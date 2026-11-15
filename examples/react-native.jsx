/**
 * React Native UUID Examples
 *
 * This file demonstrates how to use react-native-uuid in a React Native application
 */

import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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
    setTodos(current => [...current, newTodo]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => addTodo(`Todo ${todos.length + 1}`)}
      >
        <Text style={styles.buttonText}>Add todo</Text>
      </TouchableOpacity>
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
 * Example 4: Time-ordered IDs (v7) and the random source in use
 *
 * v7 UUIDs sort by creation time, which suits database keys. Random bytes
 * come from crypto.getRandomValues or the bundled native module; randomSource()
 * reports 'Math.random' only if neither is available (e.g. Expo Go without a
 * polyfill).
 */
export function SortableIDExample() {
  const [ids, setIds] = useState([]);

  return (
    <View style={styles.container}>
      <Text>Random source: {uuid.randomSource()}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIds(current => [...current, uuid.v7()])}
      >
        <Text style={styles.buttonText}>Generate v7 UUID</Text>
      </TouchableOpacity>
      {ids.map(id => (
        <Text key={id} style={styles.uuidText}>
          {id}
        </Text>
      ))}
    </View>
  );
}

/**
 * Example 5: Validating UUID input
 */
export function ValidateUUIDExample() {
  const [inputUUID, setInputUUID] = useState('');
  const isValid = inputUUID.length > 0 ? uuid.validate(inputUUID) : null;

  return (
    <View style={styles.container}>
      <Text>Enter a UUID to validate</Text>
      <TextInput
        style={styles.input}
        value={inputUUID}
        onChangeText={setInputUUID}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      />
      {isValid !== null && (
        <Text style={{color: isValid ? 'green' : 'red'}}>
          {isValid
            ? `Valid UUID (v${uuid.version(inputUUID)})`
            : 'Invalid UUID'}
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
  // Keep one tracker for the component's lifetime
  const trackerRef = useRef(null);
  if (!trackerRef.current) {
    trackerRef.current = new ObjectTracker();
    trackerRef.current.createObject({name: 'Item 1'});
    trackerRef.current.createObject({name: 'Item 2'});
  }

  const objects = trackerRef.current.getAllObjects();

  return (
    <View style={styles.container}>
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
  input: {
    marginTop: 8,
    marginBottom: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    fontFamily: 'Courier New',
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
