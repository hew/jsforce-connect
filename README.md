# jsforce-connect

A small helper for dealing with Jsforce connections.

### Usage

```js
import connect from 'jsforce-connect'

connect() // After the first connection, will automatically re-connect
connect(true) // Will force a new login for expired connections
```

MIT License
