[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / uuid

# Variable: uuid

> `const` **uuid**: `object`

Defined in: [src/index.ts:50](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/index.ts#L50)

## Type Declaration

### DNS

> **DNS**: `string`

### MAX

> **MAX**: `string`

### NIL

> **NIL**: `string`

### OID

> **OID**: `string`

### parse

> **parse**: \<`T`\>(`uuid`, `buf?`, `offset?`) => `T`

Parse a UUID string into its 16 bytes.

#### Type Parameters

##### T

`T` *extends* `Uint8Array`\<`ArrayBufferLike`\> \| `number`[] = `number`[]

#### Parameters

##### uuid

`string`

##### buf?

`T`

If given, bytes are written here instead of a new array.

##### offset?

`number`

Index in `buf` to start writing at.

#### Returns

`T`

#### Throws

TypeError('Invalid UUID') if `uuid` is not a valid UUID string
(see [validate](../functions/validate.md)).

### randomSource

> **randomSource**: () => `"crypto"` \| `"native"` \| `"Math.random"`

Name of the random source [rng](../functions/rng.md) currently uses.

#### Returns

`"crypto"` \| `"native"` \| `"Math.random"`

### rng

> **rng**: () => `Uint8Array`

Return 16 random bytes as a `Uint8Array`.

Sources, in order of preference:
1. `crypto.getRandomValues`: browsers, Node.js, and React Native with a
   polyfill such as `react-native-get-random-values`.
2. The bundled native module on React Native (iOS `SecRandomCopyBytes`,
   Android `SecureRandom`), when linked.
3. `Math.random`, which is **not** cryptographically secure.

#### Returns

`Uint8Array`

### stringify

> **stringify**: (`arr`, `offset`) => `string`

Convert 16 UUID bytes into a UUID string.

#### Parameters

##### arr

`ArrayLike`\<`number`\>

##### offset?

`number` = `0`

Index in `arr` to start reading from.

#### Returns

`string`

#### Throws

TypeError if the bytes don't form a valid UUID (e.g. values outside
0-255, or invalid version/variant bits).

### unparse

> **unparse**: (`buf`, `offset?`) => `string`

Convert 16 UUID bytes (as returned by [parse](../functions/parse.md)) into a UUID string.

Unlike [stringify](../functions/stringify.md), the result is not validated, so any 16 bytes are
accepted.

#### Parameters

##### buf

`ArrayLike`\<`number`\>

##### offset?

`number`

Index in `buf` to start reading from.

#### Returns

`string`

### URL

> **URL**: `string`

### v1

> **v1**: \{(`options?`, `buf?`, `offset?`): `string`; \<`T`\>(`options`, `buf`, `offset?`): `T`; \}

#### Call Signature

> (`options?`, `buf?`, `offset?`): `string`

Generate a time-based (version 1) UUID.

Node ID and clock sequence are random per process unless given in `options`.
Up to 10,000 UUIDs can be generated per millisecond.

##### Parameters

###### options?

[`V1Options`](../type-aliases/V1Options.md)

Override `node`, `clockseq`, `msecs`, `nsecs`, or the random source.

###### buf?

`undefined`

If given, the 16 UUID bytes are written here and `buf` is returned.

###### offset?

`number`

Index in `buf` to start writing at.

##### Returns

`string`

The UUID string, or `buf` when one is passed.

##### See

https://github.com/uuidjs/uuid for API details

#### Call Signature

> \<`T`\>(`options`, `buf`, `offset?`): `T`

Generate a time-based (version 1) UUID.

Node ID and clock sequence are random per process unless given in `options`.
Up to 10,000 UUIDs can be generated per millisecond.

##### Type Parameters

###### T

`T` *extends* [`UUIDBuffer`](../type-aliases/UUIDBuffer.md)

##### Parameters

###### options

[`V1Options`](../type-aliases/V1Options.md) \| `undefined`

Override `node`, `clockseq`, `msecs`, `nsecs`, or the random source.

###### buf

`T`

If given, the 16 UUID bytes are written here and `buf` is returned.

###### offset?

`number`

Index in `buf` to start writing at.

##### Returns

`T`

The UUID string, or `buf` when one is passed.

##### See

https://github.com/uuidjs/uuid for API details

### v1ToV6

> **v1ToV6**: \{(`uuid`): `string`; (`uuid`): `Uint8Array`; \}

#### Call Signature

> (`uuid`): `string`

Convert a v1 UUID to the equivalent v6 UUID (same timestamp, clock sequence
and node). Accepts and returns either a string or bytes.

##### Parameters

###### uuid

`string`

##### Returns

`string`

#### Call Signature

> (`uuid`): `Uint8Array`

Convert a v1 UUID to the equivalent v6 UUID (same timestamp, clock sequence
and node). Accepts and returns either a string or bytes.

##### Parameters

###### uuid

`ArrayLike`\<`number`\>

##### Returns

`Uint8Array`

### v3

> **v3**: [`GenerateUUID`](../interfaces/GenerateUUID.md)

Generate a name-based (version 3, MD5) UUID per RFC 9562.

Output matches the `uuid` npm package and Python's `uuid.uuid3`, e.g.
`v3('www.example.com', DNS)` is `'5df41881-3aed-3515-88a7-2f4a814cf09e'`.

Prefer [v5](v5.md) for new code. Throws `TypeError('Invalid UUID')` if
`namespace` is a string that is not a valid UUID.

### v4

> **v4**: \{(`options?`, `buf?`, `offset?`): `string`; \<`T`\>(`options`, `buf`, `offset?`): `T`; \}

#### Call Signature

> (`options?`, `buf?`, `offset?`): `string`

Generate a random (version 4) UUID.

Uses `crypto.randomUUID` when available and no options are given. Otherwise
random bytes come from [rng](../functions/rng.md): `crypto.getRandomValues` when available,
the bundled native module on React Native, otherwise `Math.random` (not
cryptographically secure).

##### Parameters

###### options?

[`V4Options`](../type-aliases/V4Options.md)

Supply your own random bytes or random source.

###### buf?

`undefined`

If given, the 16 UUID bytes are written here and `buf` is returned.

###### offset?

`number`

Index in `buf` to start writing at.

##### Returns

`string`

The UUID string, or `buf` when one is passed.

##### Throws

Error if fewer than 16 random bytes are supplied.

#### Call Signature

> \<`T`\>(`options`, `buf`, `offset?`): `T`

Generate a random (version 4) UUID.

Uses `crypto.randomUUID` when available and no options are given. Otherwise
random bytes come from [rng](../functions/rng.md): `crypto.getRandomValues` when available,
the bundled native module on React Native, otherwise `Math.random` (not
cryptographically secure).

##### Type Parameters

###### T

`T` *extends* [`UUIDBuffer`](../type-aliases/UUIDBuffer.md)

##### Parameters

###### options

[`V4Options`](../type-aliases/V4Options.md) \| `undefined`

Supply your own random bytes or random source.

###### buf

`T`

If given, the 16 UUID bytes are written here and `buf` is returned.

###### offset?

`number`

Index in `buf` to start writing at.

##### Returns

`T`

The UUID string, or `buf` when one is passed.

##### Throws

Error if fewer than 16 random bytes are supplied.

### v5

> **v5**: [`GenerateUUID`](../interfaces/GenerateUUID.md)

Generate a name-based (version 5, SHA-1) UUID per RFC 9562.

Output matches the `uuid` npm package and Python's `uuid.uuid5`, e.g.
`v5('www.example.com', DNS)` is `'2ed6657d-e927-568b-95e1-2665a8aea6a2'`.

Throws `TypeError('Invalid UUID')` if `namespace` is a string that is not a
valid UUID.

### v6

> **v6**: \{(`options?`, `buf?`, `offset?`): `string`; \<`T`\>(`options`, `buf`, `offset?`): `T`; \}

#### Call Signature

> (`options?`, `buf?`, `offset?`): `string`

Generate a reordered time-based (version 6) UUID per RFC 9562.

Like [v1](../functions/v1.md), but the timestamp is stored most-significant first, so v6
UUIDs sort by creation time. Node ID and clock sequence are random for
every UUID unless given in `options`.

##### Parameters

###### options?

[`V1Options`](../type-aliases/V1Options.md)

###### buf?

`undefined`

If given, the 16 UUID bytes are written here and `buf` is returned.

###### offset?

`number`

Index in `buf` to start writing at.

##### Returns

`string`

#### Call Signature

> \<`T`\>(`options`, `buf`, `offset?`): `T`

Generate a reordered time-based (version 6) UUID per RFC 9562.

Like [v1](../functions/v1.md), but the timestamp is stored most-significant first, so v6
UUIDs sort by creation time. Node ID and clock sequence are random for
every UUID unless given in `options`.

##### Type Parameters

###### T

`T` *extends* [`UUIDBuffer`](../type-aliases/UUIDBuffer.md)

##### Parameters

###### options

[`V1Options`](../type-aliases/V1Options.md) \| `undefined`

###### buf

`T`

If given, the 16 UUID bytes are written here and `buf` is returned.

###### offset?

`number`

Index in `buf` to start writing at.

##### Returns

`T`

### v6ToV1

> **v6ToV1**: \{(`uuid`): `string`; (`uuid`): `Uint8Array`; \}

#### Call Signature

> (`uuid`): `string`

Convert a v6 UUID to the equivalent v1 UUID. Accepts and returns either a
string or bytes.

##### Parameters

###### uuid

`string`

##### Returns

`string`

#### Call Signature

> (`uuid`): `Uint8Array`

Convert a v6 UUID to the equivalent v1 UUID. Accepts and returns either a
string or bytes.

##### Parameters

###### uuid

`ArrayLike`\<`number`\>

##### Returns

`Uint8Array`

### v7

> **v7**: \{(`options?`, `buf?`, `offset?`): `string`; \<`T`\>(`options`, `buf`, `offset?`): `T`; \}

#### Call Signature

> (`options?`, `buf?`, `offset?`): `string`

Generate a Unix-epoch time-based (version 7) UUID per RFC 9562.

v7 UUIDs sort by creation time, which makes them a good fit for database
keys. Without `options`, UUIDs from this process are strictly increasing,
even within the same millisecond.

##### Parameters

###### options?

[`V7Options`](../type-aliases/V7Options.md)

###### buf?

`undefined`

If given, the 16 UUID bytes are written here and `buf` is returned.

###### offset?

`number`

Index in `buf` to start writing at.

##### Returns

`string`

##### Throws

Error if fewer than 16 random bytes are supplied.

#### Call Signature

> \<`T`\>(`options`, `buf`, `offset?`): `T`

Generate a Unix-epoch time-based (version 7) UUID per RFC 9562.

v7 UUIDs sort by creation time, which makes them a good fit for database
keys. Without `options`, UUIDs from this process are strictly increasing,
even within the same millisecond.

##### Type Parameters

###### T

`T` *extends* [`UUIDBuffer`](../type-aliases/UUIDBuffer.md)

##### Parameters

###### options

[`V7Options`](../type-aliases/V7Options.md) \| `undefined`

###### buf

`T`

If given, the 16 UUID bytes are written here and `buf` is returned.

###### offset?

`number`

Index in `buf` to start writing at.

##### Returns

`T`

##### Throws

Error if fewer than 16 random bytes are supplied.

### validate

> **validate**: (`uuid`) => `uuid is string`

Check whether `uuid` is a valid RFC 9562 (formerly RFC 4122) UUID string:
versions 1-8, the nil UUID, or the max UUID. Case-insensitive.

#### Parameters

##### uuid

`unknown`

#### Returns

`uuid is string`

### version

> **version**: (`uuid`) => `number`

Return the version number of a UUID string: 1-8, `0` for the nil UUID, or
`15` for the max UUID.

#### Parameters

##### uuid

`string`

#### Returns

`number`

#### Throws

TypeError if `uuid` is not valid.

### X500

> **X500**: `string`
