[**react-native-uuid**](../modules.md)

***

[react-native-uuid](../modules.md) / GenerateUUID

# Interface: GenerateUUID()

Defined in: [src/v35.ts:7](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v35.ts#L7)

A name-based UUID generator ([v3](../variables/v3.md) or [v5](../variables/v5.md)).

## Call Signature

> **GenerateUUID**(`value`, `namespace`): `string`

Defined in: [src/v35.ts:8](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v35.ts#L8)

A name-based UUID generator ([v3](../variables/v3.md) or [v5](../variables/v5.md)).

### Parameters

#### value

`string` \| `ArrayLike`\<`number`\>

#### namespace

`string` \| `ArrayLike`\<`number`\>

### Returns

`string`

## Call Signature

> **GenerateUUID**\<`T`\>(`value`, `namespace`, `buf`, `offset?`): `T`

Defined in: [src/v35.ts:12](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v35.ts#L12)

A name-based UUID generator ([v3](../variables/v3.md) or [v5](../variables/v5.md)).

### Type Parameters

#### T

`T` *extends* [`UUIDBuffer`](../type-aliases/UUIDBuffer.md)

### Parameters

#### value

`string` \| `ArrayLike`\<`number`\>

#### namespace

`string` \| `ArrayLike`\<`number`\>

#### buf

`T`

#### offset?

`number`

### Returns

`T`

## Properties

### DNS

> `readonly` **DNS**: `string`

Defined in: [src/v35.ts:19](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v35.ts#L19)

The DNS namespace UUID.

***

### URL

> `readonly` **URL**: `string`

Defined in: [src/v35.ts:21](https://github.com/eugenehp/react-native-uuid/blob/v3.0.0/src/v35.ts#L21)

The URL namespace UUID.
