[react-native-uuid](..) / [Exports](../modules.md) / index

# Module: index

## Table of contents

### References

- [GenerateUUID](index.md#generateuuid)

### Properties

- [default](index.md#default)

## References

### GenerateUUID

Re-exports: [GenerateUUID](v35.md#generateuuid)

## Properties

### default

• **default**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`DNS` | *string* |
`NIL` | *string* |
`OID` | *string* |
`URL` | *string* |
`X500` | *string* |
`parse` | (`s`: *string*, `buf?`: *number*[], `offset?`: *number*) => *number*[] |
`unparse` | (`buf`: *number*[], `offset?`: *number*) => *string* |
`v1` | (`options?`: V1Options, `buf?`: *Uint8Array*, `offset`: *number*) => *string* \| *Uint8Array* |
`v3` | [*GenerateUUID*](v35.md#generateuuid) |
`v4` | (`options?`: *string* \| V4Options, `buf?`: *number*[], `offset?`: *number*) => *string* \| *number*[] |
`v5` | [*GenerateUUID*](v35.md#generateuuid) |
`validate` | (`uuid`: *string*) => *boolean* |
`version` | (`uuid`: *string*) => *number* |
