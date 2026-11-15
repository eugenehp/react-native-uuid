[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / V7Options

# Type Alias: V7Options

> **V7Options** = `object`

Defined in: [src/v7.ts:7](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v7.ts#L7)

Options for [v7](../functions/v7.md). Every field is optional.

## Properties

### msecs?

> `optional` **msecs?**: `number`

Defined in: [src/v7.ts:9](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v7.ts#L9)

Time in milliseconds since the Unix epoch. Defaults to `Date.now()`.

***

### random?

> `optional` **random?**: `ArrayLike`\<`number`\>

Defined in: [src/v7.ts:13](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v7.ts#L13)

16 random bytes to use instead of generating them.

***

### rng?

> `optional` **rng?**: () => `ArrayLike`\<`number`\>

Defined in: [src/v7.ts:15](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v7.ts#L15)

Function returning 16 random bytes.

#### Returns

`ArrayLike`\<`number`\>

***

### seq?

> `optional` **seq?**: `number`

Defined in: [src/v7.ts:11](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v7.ts#L11)

32-bit sequence number, used to order UUIDs within one millisecond.
