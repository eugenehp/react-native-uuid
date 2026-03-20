/**
 * Basic UUID Generation Examples
 *
 * This file demonstrates the most common use cases for react-native-uuid
 */

import uuid from 'react-native-uuid';

// Example 1: Generate a random UUID (v4)
console.log('Random UUID (v4):', uuid.v4());
// Output: Random UUID (v4): 550e8400-e29b-41d4-a716-446655440000

// Example 2: Generate a time-based UUID (v1)
console.log('Time-based UUID (v1):', uuid.v1());
// Output: Time-based UUID (v1): 550e8400-e29b-41d4-a716-446655440000

// Example 3: Generate a deterministic UUID from a namespace and name (v3)
const v3UUID = uuid.v3('hello', uuid.DNS);
console.log('DNS Namespace UUID (v3):', v3UUID);
// Output: DNS Namespace UUID (v3): 5df41881-3c2f-36d7-b546-49953ef87ae0

// Example 4: Generate a deterministic UUID using SHA1 (v5)
const v5UUID = uuid.v5('hello', uuid.DNS);
console.log('DNS Namespace UUID (v5):', v5UUID);
// Output: DNS Namespace UUID (v5): 9d4e8b3a-2c8e-5e7a-9d2e-8b3a2c8e5e7a

// Example 5: Parse a UUID string to bytes
const uuidString = '550e8400-e29b-41d4-a716-446655440000';
const bytes = uuid.parse(uuidString);
console.log('UUID bytes:', bytes);
// Output: UUID bytes: Uint8Array(16) [ 85, 14, 132, 0, 226, 155, 65, 212, 167, 22, 68, 102, 85, 68, 0, 0 ]

// Example 6: Convert UUID bytes back to string
const byteArray = [
  85, 14, 132, 0, 226, 155, 65, 212, 167, 22, 68, 102, 85, 68, 0, 0,
];
const reconstructed = uuid.unparse(byteArray);
console.log('Reconstructed UUID:', reconstructed);
// Output: Reconstructed UUID: 550e8400-e29b-41d4-a716-446655440000

// Example 7: Validate a UUID
console.log(
  'Is "550e8400-e29b-41d4-a716-446655440000" valid?',
  uuid.validate('550e8400-e29b-41d4-a716-446655440000'),
);
// Output: Is "550e8400-e29b-41d4-a716-446655440000" valid? true

console.log('Is "invalid-uuid" valid?', uuid.validate('invalid-uuid'));
// Output: Is "invalid-uuid" valid? false

// Example 8: Get UUID version number
console.log('Version of v3 UUID:', uuid.version(v3UUID));
// Output: Version of v3 UUID: 3

console.log('Version of v4 UUID:', uuid.version(uuid.v4()));
// Output: Version of v4 UUID: 4

// Example 9: Work with other namespaces
const urlNamespace = uuid.v5('https://example.com', uuid.URL);
console.log('URL Namespace UUID:', urlNamespace);

const oidNamespace = uuid.v5('2.5.4.3', uuid.OID);
console.log('OID Namespace UUID:', oidNamespace);

const x500Namespace = uuid.v5('CN=Example', uuid.X500);
console.log('X500 Namespace UUID:', x500Namespace);

// Example 10: NIL UUID (all zeros)
console.log('NIL UUID:', uuid.NIL);
// Output: NIL UUID: 00000000-0000-0000-0000-000000000000
