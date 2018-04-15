const openpgp = require('openpgp/dist/openpgp.min.js')

module.exports.GitOpenPGP = {
  name: 'GitOpenPGP',
  signingHelper: {
    async sign ({ payload, secretKey }) {
      let { signature } = await openpgp.sign({
        data: payload,
        privateKeys: openpgp.key.readArmored(secretKey).keys,
        detached: true,
        armor: true
      })
      return signature
    },
    async verify ({ payload, signature, publicKey }) {
      // let msg = openpgp.message.readSignedContent(payload, signature)
      let {signatures} = await openpgp.verify({
        message: openpgp.message.fromText(payload),
        signature: openpgp.signature.readArmored(signature),
        publicKeys: openpgp.key.readArmored(publicKey).keys
      })
      let invalid = []
      let valid = []
      for (let sig of signatures) {
        if (sig.valid) {
          valid.push(sig.keyid.toHex())
        } else {
          invalid.push(sig.keyid.toHex())
        }
      }
      // We do this extra mashing to simplify client-side logic that
      // is less interested in the values than the presence of values
      let result = {}
      if (valid.length > 0) result.valid = valid
      if (invalid.length > 0) result.invalid = invalid
      return result
    }
  }
}
