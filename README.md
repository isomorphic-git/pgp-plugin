# @isomorphic-git/openpgp-plugin

OpenPGP.js plugin for isomorphic-git 1.x

## Usage

```js
const { GitOpenPGP } = require('@isomorphic-git/openpgp-plugin')
const git = require('isomorphic-git')

git.use(GitOpenPGP)

// Now you can use git.sign() and git.verify()
```

## Tests

TBD

## License

In keeping with the OpenPGP.js license, this project is licensed under the
GNU Lesser General Public License v3.0
