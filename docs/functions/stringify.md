[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / stringify

# Function: stringify()

> **stringify**(`arr`, `offset?`): `string`

Defined in: [src/stringify.ts:44](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/stringify.ts#L44)

Convert 16 UUID bytes into a UUID string.

## Parameters

### arr

`ArrayLike`\<`number`\>

### offset?

`number` = `0`

Index in `arr` to start reading from.

## Returns

`string`

## Throws

TypeError if the bytes don't form a valid UUID (e.g. values outside
0-255, or invalid version/variant bits).
