import JWT from 'jsonwebtoken'
let secret = 'maxfiy-malumot'

export default {
    sign: (payload) => JWT.sign(payload, secret),
    verify: (token) => JWT.verify(token, secret)
}