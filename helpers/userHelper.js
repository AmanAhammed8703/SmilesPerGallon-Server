const db = require('../config/connection')
const bcrypt = require('bcrypt')
const collection = require('../config/collection')
module.exports = {
    doSignUp: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne({
                userName: data.userName,
                email: data.email,
                mobileNumber: data.mobileNumber,
                password: data.password
            }).then((res) => {
                console.log(res);
                resolve(true)
            })
        })
    },
    isUserExists: (number, mail) => {
        return new Promise(async (resolve, reject) => {
            const user = await db.get().collection(collection.USER_COLLECTION).findOne({ $or: [{ mobileNumber: number }, { email: mail }] })
            console.log(user);
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    },
    doLogIn: (data) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            const user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: data.email })
            console.log(user);
            if (user) {
                bcrypt.compare(data.password, user.password).then((resp) => {
                    if (resp) {

                        response.user = true

                    } else {
                        response.user = false
                    }
                    resolve(response)
                })
            }
        })
    }
}