import argon2, { argon2id } from 'argon2'
import crypto from 'crypto'
import { UserModel } from '../models'
import { UniqueID } from 'nodejs-snowflake'
import server from '..'

const UserRouter = server.router('/account')

const usernameRegex = /^(?:[A-Z]|[a-z]|[0-9]|\.|\_|\-){3,20}$/i
// Retreived from https://www.emailregex.com/ on the 5th of October 2021
const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
const customEpoch: number | undefined = !process.env.EPOCH ? process.env.EPOCH as undefined : +process.env.EPOCH

UserRouter.route('/login').post(async (req, res, next) => {
  try {
    if (req.headers['content-type'] !== 'application/json') throw new Error('415::invalid_content_type')
    if (!req.body) throw new Error('400::body_missing')
    if (!req.clientIp) throw new Error('403::unprocessable_ip')
    if (!req.body.username) throw new Error('400::username_invalid')
    if (!req.body.password) throw new Error('400::password_invalid')
  
    let user = await UserModel.findOne({
      [req.body.username.includes('@')
        ? 'email'
        : 'username']: req.body.username.toLowerCase()
    }).exec() as any
    if (!user) throw new Error('401::username_invalid')
  
    let comparison = await argon2.verify(user.password, req.body.password, { 
      type: argon2id, 
    })
    if (!comparison) throw new Error('401::password_invalid')
  
    const sessionToken = await initSession(user.id, req.clientIp as string);
    return res.status(200).json({
      message: 'Successfully logged in!',
      data: {
        sessionToken: (sessionToken as any).token, 
        user: {
          username: user.username,
          displayname: user.displayname,
          id: user.id,
          flags: user.flags,
          email: user.email,
          joinedAt: user.joinedAt,
          avatar: user.avatar
        }
      }
    })
  } catch (err: any) {server.error(req, res, err)}
})

UserRouter.route('/register').post(async (req, res, next) => {
  try {
    if (req.headers['content-type'] !== 'application/json') throw new Error('415::invalid_content_type')
    if (!req.body) throw new Error('400::body_missing')
    if (!req.clientIp) throw new Error('403::unprocessable_ip')
    if (!req.body.username || !req.body.username.match(usernameRegex)) throw new Error('400::username_invalid')
    if (!req.body.email || !req.body.email.match(emailRegex)) throw new Error('400::email_invalid')
    if (!req.body.password) throw new Error('400::password_missing')
    if (req.body.username.length <= 2) throw new Error('400::username_too_short')
  
    let emails = await UserModel.find({
      email: req.body.email.toLowerCase(),
    }).exec()
    let usernames = await UserModel.find({
      username: req.body.username.toLowerCase(),
    }).exec()
  
    if (usernames.length > 0) throw {status: 403, err: 'username_taken'}
    if (emails.length > 0) throw {status: 403, err: 'email_taken'}
  
    const hashedPassword = await argon2.hash(req.body.password, {
      type: argon2id,
    })
    let user = new UserModel({
      username: req.body.username.toLowerCase(),
      displayname: req.body.displayname || req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      id: new UniqueID({ customEpoch }).getUniqueID() as string,
      joinedAt: new Date(),
    }) as any
    await user.save()
  
    const sessionToken = await initSession(user.id, req.clientIp as string);
    res.status(200).json({
      message: 'Successfully created your account.',
      data: {
        sessionToken: (sessionToken as any).token,
        user: {
          displayname: user.displayname,
          username: user.username,
          id: user.id,
          flags: user.flags,
          email: user.email,
          joinedAt: user.joinedAt,
          avatar: user.avatar
        }
      }
    })
  } catch (err: any) {server.error(req, res, err)}
})

UserRouter.route('/logout').delete(async (req, res) => {
  // TODO
})

export default UserRouter

async function initSession (userId: string, clientIp: string) {
  const sessionToken = crypto.randomBytes(96).toString('base64')
  let session = {
    token: sessionToken,
    ip: clientIp
  }
  await UserModel.updateOne({id: userId}, { $push: { sessions: session}})
  return session;
}