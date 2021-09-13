
const mongoUrl = 'mongodb://db:27017'

const connect = async () => {
    return await mongodb.MongoClient.connect(mongoUrl)
}

async function insert() {
    let user = {
        username: "byc" ,
        password: "",
        active: false
    }
    let client = await connect()
    await client.db('test').collection('users').insertOne(user)
    
}