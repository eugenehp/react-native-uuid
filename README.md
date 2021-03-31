# react-native-uuid

`react-native-uuid` is a zero-dependency TypeScript implementation of [RFC4122](https://tools.ietf.org/html/rfc4122) standard **A Universally Unique IDentifier (UUID) URN Namespace**. Please note, this library uses pseudo random generator based on top of `Math.randoom`. New version with hardware support is WIP.

**Heavily inspired by:**

- [uuid](https://github.com/uuidjs/uuid)

- [pure-uuid](https://github.com/rse/pure-uuid)

Huge thanks to [Randy Coulman](https://github.com/randycoulman) for the early version of a code.

## Getting started

Use this steps to install and create UUIDs.

### 1. Install

```shell
npm install react-native-uuid
```

### 2. Create a UUID (ES6 module syntax)

```javascript
import uuid from 'uuid';
uuid.v4(); // ⇨ '11edc52b-2918-4d71-9058-f7285e29d894'
```

## Troubleshooting

Previous version has been based on `randombytes` that is not compatible with react-native out of the box.
Please submit an [issue](https://github.com/eugenehp/react-native-uuid/issues) if you found a bug.


Copyright (c) 2016-2021 Eugene Hauptmann
