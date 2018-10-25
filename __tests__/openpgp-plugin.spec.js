/* eslint-env node, browser, jasmine */
const { pgp } = require('..')
const { secretKey, publicKey } = require('./__fixtures__/keys.json')

const cryptoRandomString = require('crypto-random-string')

describe('sign & verify', async () => {
  it('simple "Hello world" test', async () => {
    let payload = 'Hello world'
    let { signature } = await pgp.sign({ payload, secretKey })
    // Because signatures contain a random element, we cannot use snapshot testing. :(
    expect(signature).toEqual(
      expect.stringContaining('-----BEGIN PGP SIGNATURE-----')
    )
    let { valid, invalid } = await pgp.verify({ payload, publicKey, signature })
    expect(valid).toEqual(['a01edd29ac0f3952'])
    expect(invalid).toEqual([])
  })

  it('corrupted payload is invalid signature', async () => {
    let payload = 'Hello world'
    let { signature } = await pgp.sign({ payload, secretKey })
    payload = 'Hello_world'
    let { valid, invalid } = await pgp.verify({ payload, publicKey, signature })
    expect(invalid).toEqual(['a01edd29ac0f3952'])
    expect(valid).toEqual([])
  })

  it('corrupted signature throws error', async () => {
    let payload = 'Hello world'
    let { signature } = await pgp.sign({ payload, secretKey })
    let letter = String.fromCharCode(signature[256].charCodeAt() - 1)
    signature = signature.slice(256, 1, letter)
    let error = null
    try {
      let { valid, invalid } = await pgp.verify({
        payload,
        publicKey,
        signature
      })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
  })

  it('large random string', async () => {
    let payload = cryptoRandomString(5000)
    let { signature } = await pgp.sign({ payload, secretKey })
    // Because signatures contain a random element, we cannot use snapshot testing. :(
    expect(signature).toEqual(
      expect.stringContaining('-----BEGIN PGP SIGNATURE-----')
    )
    let { valid, invalid } = await pgp.verify({ payload, publicKey, signature })
    expect(valid).toEqual(['a01edd29ac0f3952'])
    expect(invalid).toEqual([])
  })
})
