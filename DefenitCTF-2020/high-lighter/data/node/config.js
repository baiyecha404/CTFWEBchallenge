module.exports = {
    SECRET: require('crypto').randomBytes(64).toString('hex'),
    DB_CONFIG: {
        host: 'db',
        user: 'highlighter',
        password: 'highlighter',
        database: 'highlighter'
    }
}