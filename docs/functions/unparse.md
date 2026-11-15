[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / unparse

# Function: unparse()

> **unparse**(`buf`, `offset?`): `string`

Defined in: [src/unparse.ts:11](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/unparse.ts#L11)

Convert 16 UUID bytes (as returned by [parse](parse.md)) into a UUID string.

Unlike [stringify](stringify.md), the result is not validated, so any 16 bytes are
accepted.

## Parameters

### buf

`ArrayLike`\<`number`\>

### offset?

`number`

Index in `buf` to start reading from.

## Returns

`string`
