const openpgp = require('openpgp')

module.exports.pgp = {
  async sign ({ payload, secretKey }) {
    let { signature } = await openpgp.sign({
      message: openpgp.message.fromText(payload),
      privateKeys: (await openpgp.key.readArmored(secretKey)).keys,
      detached: true,
      armor: true
    })
    return { signature }
  },
  async verify ({ payload, publicKey, signature }) {
    // let msg = openpgp.message.readSignedContent(payload, signature)
    let { signatures } = await openpgp.verify({
      message: openpgp.message.fromText(payload),
      signature: await openpgp.signature.readArmored(signature),
      publicKeys: (await openpgp.key.readArmored(publicKey)).keys
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
    return { valid, invalid }
  }
}
