/* eslint-env node, browser, jasmine */
const { pgp } = require('..')
const { secretKey, publicKey } = require('./__helpers__/keys.js')

const cryptoRandomString = require('crypto-random-string')

describe('sign & verify', async () => {
  it('simple "Hello world" test', async () => {
    let payload = 'Hello world'
    let timestamp = 1542908995
    let { signature } = await pgp.sign({ payload, secretKey, timestamp })
    expect(signature).toEqual(
      `-----BEGIN PGP SIGNATURE-----

iJwEAAEIAAYFAlv27EMACgkQ8vDO2KUmE8S4FwQAmxiQD27P4Nm3lHM3XrPqb2RR
nWj26Qo5nlhdpg482cxba3Z5Kf/zQROJhz0uJu8LVVPYyqMJw3NUcCYcfpYYw6NT
5HYsDpPPPgYcxcjP+6/VaS5rm1sG0efd3cGNsi392rKsKqKYnaEV9LJFUHaiCBEQ
KKpy9lbjLXPgBcRiXgA=
=dQsk
-----END PGP SIGNATURE-----`
    )
    let { valid, invalid } = await pgp.verify({ payload, publicKey, signature })
    expect(valid).toEqual(['f2f0ced8a52613c4'])
    expect(invalid).toEqual([])
  })

  it('corrupted payload throws error', async () => {
    let payload = 'Hello world'
    let { signature } = await pgp.sign({ payload, secretKey })
    payload = 'Hello_world'
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
    expect(signature.startsWith('-----BEGIN PGP SIGNATURE-----')).toBe(true);
    let { valid, invalid } = await pgp.verify({ payload, publicKey, signature })
    expect(valid).toEqual(['f2f0ced8a52613c4'])
    expect(invalid).toEqual([])
  })

  it('validates a git commit', async () => {
    let signature = "-----BEGIN PGP SIGNATURE-----\n\niQIcBAABAgAGBQJb0ldBAAoJEJYJuKWSi6a56N8P/14lzvTTxRT4+mTvmXH0I5Ol\nQZEZuki9vAcV5lcRuGNtJ/+dqFIb8nj3MKYy2E1bHUIQmb/Eqgw+fRASONtC4k3w\nXO98svGD4+HJvSkyvlBJA/p7MF0xad509MBHrzTEp5TsHciF74JC8tqzbeKyFrG/\n2vStQKoRceEhk2d4EKt0B7Q58pUSzdJvpivRyNwk/WTzRjaLybd0kxcuemnuArPG\nkZPcf/VWrxtQhIl8GCACf+0X9jcoB43h0VLsBMTea4sXRf3HkKzlMO1lOoFgf4KA\nezUEpbss6GoRwA/Qj7uPFSPj//0+cS/MwLOa0qRKtS7LQPFh3CnT/BhropMAuMmG\n253XgcKGuONdKw/OWIA/uctQwrnncZsGmKkGRKflt+6TsimMABMk9RS4eOzFKpHZ\nybU8oIINB9PmaI4Box1syxPUEsjC85w8c88pnvX7JlA6RJJ3c+6RO4lvefqN8TD1\nTASJK6C07gN5ZDBMBjlUud7be05lYrASu0jXy538C7bEhHFBPUqdKb/VtTszma2I\nX1Hx4uyh6C1EuSeGBQUUsQoXfPhxqjgsgrHSQ3sfabEJhlTBqKqmoWEhYotqmXC5\nY4yKEA486+ElQkPzi/SpsGe/gqaNp8A+50LwohZlA3LRc5W/D0pMIvIbCq/3a95A\nZ6e744fK9NMccQfO9b9z\n=4UMM\n-----END PGP SIGNATURE-----"
    let payload = "tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\nauthor William Hilton <wmhilton@gmail.com> 1540511553 -0400\ncommitter William Hilton <wmhilton@gmail.com> 1540511553 -0400\n\nInitial commit\n"
    let publicKey = "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\ndGs=\n=QSo+\n-----END PGP PUBLIC KEY BLOCK-----"

    let { valid, invalid } = await pgp.verify({ payload, publicKey, signature })
    expect(valid).toEqual(['9609b8a5928ba6b9'])
    expect(invalid).toEqual([])
  })
})
