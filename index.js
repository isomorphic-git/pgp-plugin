const openpgp = require('openpgp')

const toBinary = (data) => {
  data = openpgp.util.encode_utf8(data)
  data = openpgp.util.str_to_Uint8Array(data)
  return data
}

module.exports.pgp = {
  async sign ({ payload, secretKey }) {
    // We need to use fromBinary because fromText screws with line endings
    const data = toBinary(payload) //openpgp.util.encode_utf8(payload)
    const privateKeys = (await openpgp.key.readArmored(secretKey)).keys
    let { signature } = await openpgp.sign({
      data,
      privateKeys,
      detached: true,
      armor: true
    })
    return { signature }
  },
  async verify ({ payload, publicKey, signature }) {
    const data = toBinary(payload)
    const message = openpgp.message.fromBinary(data)
    signature = await openpgp.signature.readArmored(signature)
    const publicKeys = (await openpgp.key.readArmored(publicKey)).keys
    let { signatures } = await openpgp.verify({
      message,
      signature,
      publicKeys
    })
    let invalid = []
    let valid = []
    for (let sig of signatures) {
      (sig.valid ? valid : invalid).push(sig.keyid.toHex())
    }
    return { valid, invalid }
  }
}
