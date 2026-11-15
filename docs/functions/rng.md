[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / rng

# Function: rng()

> **rng**(): `Uint8Array`

Defined in: [src/rng.ts:43](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/rng.ts#L43)

Return 16 random bytes as a `Uint8Array`.

Sources, in order of preference:
1. `crypto.getRandomValues`: browsers, Node.js, and React Native with a
   polyfill such as `react-native-get-random-values`.
2. The bundled native module on React Native (iOS `SecRandomCopyBytes`,
   Android `SecureRandom`), when linked.
3. `Math.random`, which is **not** cryptographically secure.

## Returns

`Uint8Array`
