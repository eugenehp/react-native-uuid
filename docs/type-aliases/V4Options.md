[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / V4Options

# Type Alias: V4Options

> **V4Options** = `object`

Defined in: [src/v4.ts:9](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v4.ts#L9)

Options for [v4](../functions/v4.md). `random` takes precedence over `rng`.

## Properties

### random?

> `optional` **random?**: `ArrayLike`\<`number`\>

Defined in: [src/v4.ts:11](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v4.ts#L11)

16 random bytes to use instead of generating them.

***

### rng?

> `optional` **rng?**: () => `ArrayLike`\<`number`\>

Defined in: [src/v4.ts:13](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v4.ts#L13)

Function returning 16 random bytes.

#### Returns

`ArrayLike`\<`number`\>
