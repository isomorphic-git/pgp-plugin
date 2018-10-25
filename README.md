# @isomorphic-git/openpgp-plugin

OpenPGP.js plugin for [a future version of] isomorphic-git

Note: no version of isomorphic-git has been released that uses this plugin yet.

It's a chicken and egg problem. Gotta write the plugin first, then modify isomorphic-git to use it.

## Usage

```js
// Node
const { pgp } = require('@isomorphic-git/openpgp-plugin')
const git = require('isomorphic-git')

git.plugins.set('pgp', pgp)

// Now you can use git.sign() and git.verify()
```

OpenPGP.js is unfortunately licensed under the LGPL-3.0 and thus cannot be included in a minified bundle with
isomorphic-git which is an MIT/BSD style library, because that would violate the "dynamically linked" stipulation.
If you are building a browser app, you should include this plugin as separate script.

I'm not a lawyer, but I suspect that code-splitting counts as "dynamically linked".
Here I use a dynamic import statement to load the module.

```js
// Browser
import { plugins } from 'isomorphic-git'

import('@isomorphic-git/openpgp-plugin').then(({ pgp }) => {
  git.plugins.set('pgp', pgp)
  // Now you can use git.sign() and git.verify()
})
```

## Tests

```sh
npm test
```

## License

In keeping with the OpenPGP.js license, this project is licensed under the
GNU Lesser General Public License v3.0
