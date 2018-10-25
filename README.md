# @isomorphic-git/openpgp-plugin

OpenPGP.js plugin for [a future version of] isomorphic-git

Note: no version of isomorphic-git has been released that uses this plugin yet.

It's a chicken and egg problem. Gotta write the plugin first, then modify isomorphic-git to use it.

## Usage

```js
const { pgp } = require('@isomorphic-git/openpgp-plugin')
const git = require('isomorphic-git')

git.plugins.set('pgp', pgp)

// Now you can use git.sign() and git.verify()
```

## Tests

```sh
npm test
```

## License

In keeping with the OpenPGP.js license, this project is licensed under the
GNU Lesser General Public License v3.0
