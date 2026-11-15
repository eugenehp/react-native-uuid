[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / V1Options

# Type Alias: V1Options

> **V1Options** = `object`

Defined in: [src/v1.ts:7](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v1.ts#L7)

Options for [v1](../functions/v1.md) and [v6](../functions/v6.md). Every field is optional.

## Properties

### clockseq?

> `optional` **clockseq?**: `number`

Defined in: [src/v1.ts:11](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v1.ts#L11)

14-bit clock sequence. Defaults to a random value.

***

### msecs?

> `optional` **msecs?**: `number`

Defined in: [src/v1.ts:13](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v1.ts#L13)

Time in milliseconds since the Unix epoch. Defaults to `Date.now()`.

***

### node?

> `optional` **node?**: `ArrayLike`\<`number`\>

Defined in: [src/v1.ts:9](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v1.ts#L9)

6-byte node ID. Defaults to a random value (with the multicast bit set).

***

### nsecs?

> `optional` **nsecs?**: `number`

Defined in: [src/v1.ts:15](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v1.ts#L15)

Extra time in 100-nanosecond units (0-9999) added to `msecs`.

***

### random?

> `optional` **random?**: `ArrayLike`\<`number`\>

Defined in: [src/v1.ts:17](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v1.ts#L17)

16 random bytes used to seed `node` and `clockseq`.

***

### rng?

> `optional` **rng?**: () => `ArrayLike`\<`number`\>

Defined in: [src/v1.ts:19](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v1.ts#L19)

Function returning 16 random bytes, used instead of `random`.

#### Returns

`ArrayLike`\<`number`\>
