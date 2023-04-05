require('dotenv').config();
const PORT = 8000
const uri = 'mongodb+srv://rtgeorgiev:mypassword@Cluster0.hkj2v1s.mongodb.net/?retryWrites=true&w=majority'
const AWS = require('aws-sdk')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const clienturl = process.env.CLIENT_URL
const accessKey = process.env.ACCESS_KEY_ID
const secretKey = process.env.SECRET_ACCESS_KEY
const region = process.env.REGION
const myemail = process.env.EMAIL

const sendVerificationEmail = async (email, verificationToken) => {
    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Please click on this link to verify your email: ${clienturl}/verify/${verificationToken}`
                }
            },
            Subject: {
                Data: 'Verify your email'
            }
        },
        Source: email,
        ReplyToAddresses: [myemail]
    }

    try {
        await ses.sendEmail(params).promise()
        console.log(`Verification email sent to ${email}`)
    } catch (err) {
        console.log(err)
    }
}

const app = express()
app.use(cors())
app.use(express.json())

// Configure AWS SDK
AWS.config.update({
    apiVersion: '2010-12-01',
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    sslEnabled: true,
    region: region
})
const ses = new AWS.SES({ apiVersion: '2010-12-01' })

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    SES: { ses, aws: AWS }
})

// Default
app.get('/', (req, res) => {
    res.json('Hello to my app')
})

// Define endpoint for user sign up
app.post('/signup', async (req, res) => {
    // Initialize MongoDB client
    const client = new MongoClient(uri)
    const {email, password} = req.body
    // Generate unique user ID and hash password for storage
    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        // Connect to database
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        // Check if user already exists in database
        const existingUser = await users.findOne({email})

        if (existingUser) {
            return res.status(409).send('User already exists. Please login')
        }
        // Sanitize email and generate verification token
        const sanitizedEmail = email.toLowerCase()
        const verificationToken = uuidv4() // generate verification token
        // Store user data (including verification token) in database
        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword,
            verification_token: verificationToken // store verification token in database
        }
        const insertedUser = await users.insertOne(data)

        // Send verification email
        await sendVerificationEmail(sanitizedEmail, verificationToken)
        // Generate JWT token and send response with token and user ID
        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        })
        res.status(201).json({token, userId: generatedUserId})

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

// Define endpoint for verifying user's email
app.get('/verify/:verificationToken', async (req, res) => {
    const client = new MongoClient(uri)

    const {verificationToken} = req.params

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        // Find user with matching verification token and remove token from database
        const user = await users.findOne({verification_token: verificationToken})

        if (user) {
            await users.updateOne({verification_token: verificationToken}, {$unset: {verification_token: ''}})
            return res.status(200).send('Email verified')
        }
        // Return error if verification token is invalid
        res.status(404).send('Invalid verification link')

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

// Check user verification status
app.get('/verify-status/:userId', async (req, res) => {
    const client = new MongoClient(uri)

    const {userId} = req.params

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        // Check if user exists in database and if their verification token is null (indicating they are verified)
        const user = await users.findOne({user_id: userId})

        if (user && user.verification_token === null) {
            return res.status(200).send('User is verified')
        }

        res.status(404).send('User is not verified')

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

// Log in
app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const {email, password} = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({email})

        const correctPassword = await bcrypt.compare(password, user.hashed_password)
        // Create a JWT token with user data and email
        if (user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(201).json({token, userId: user.user_id})
        } else {
            res.status(400).json('Invalid Credentials')
        }

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

// Retrieve individual users
app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: userId}
        const user = await users.findOne(query)
        res.send(user)

    } finally {
        await client.close()
    }
})

// Update matches
app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri)
    const {userId, matchedUserId} = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: userId}
        const updateDocument = {
            $push: {matches: {user_id: matchedUserId}}
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
})

// Retrieve all users by their id
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]

        const foundUsers = await users.aggregate(pipeline).toArray()

        res.json(foundUsers)

    } finally {
        await client.close()
    }
})

// Access gendered users in the database
app.get('/gendered-users', async (req, res) => {
    const client = new MongoClient(uri)
    const gender = req.query.gender

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = {gender_identity: {$eq: gender}}
        const foundUsers = await users.find(query).toArray()
        res.json(foundUsers)

    } finally {
        await client.close()
    }
})

// Update user profiles in the database upon completion of the form
app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: formData.user_id}

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                university: formData.university,
                course: formData.course,
                year_of_study: formData.year_of_study,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

// Retrieve message from the database based on sender and receiver
app.get('/messages', async (req, res) => {
    const {userId, correspondingUserId} = req.query
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})

// Store messages in the database
app.post('/message', async (req, res) => {
    const client = new MongoClient(uri)
    const message = req.body.message

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})

app.post('/block', async (req, res) => {
    const client = new MongoClient(uri)
    const blockingUserId = req.body.blockingUserId
    const blockedUserId = req.body.blockedUserId

    try {
        await client.connect()
        const database = client.db('app-data')
        const blockedUsers = database.collection('blockedUsers')

        const insertedBlockedUser = await blockedUsers.insertOne({
            blockingUserId,
            blockedUserId,
            timestamp: new Date().toISOString(),
        })

        res.send(insertedBlockedUser)
    } finally {
        await client.close()
    }
})

app.get('/blocked', async (req, res) => {
    const { blockingUserId } = req.query;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('app-data');
        const blockedUsers = database.collection('blockedUsers');

        const query = { blockingUserId: blockingUserId };
        const blockedUserDocs = await blockedUsers.find(query).toArray();
        const blockedUserIds = blockedUserDocs.map(doc => doc.blockedUserId);

        res.send(blockedUserIds);
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => console.log('server running on PORT ' + PORT))