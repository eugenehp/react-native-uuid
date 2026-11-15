[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / parse

# Function: parse()

> **parse**\<`T`\>(`uuid`, `buf?`, `offset?`): `T`

Defined in: [src/parse.ts:13](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/parse.ts#L13)

Parse a UUID string into its 16 bytes.

## Type Parameters

### T

`T` *extends* `Uint8Array`\<`ArrayBufferLike`\> \| `number`[] = `number`[]

## Parameters

### uuid

`string`

### buf?

`T`

If given, bytes are written here instead of a new array.

### offset?

`number`

Index in `buf` to start writing at.

## Returns

`T`

## Throws

TypeError('Invalid UUID') if `uuid` is not a valid UUID string
(see [validate](validate.md)).
