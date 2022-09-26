require('dotenv').config

module.exports = {
    PORT: process.env.PORT || 8080,
    SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
    TOKEN_KEY: process.env.TOKEN_KEY || "superSercetKey",
    SESSION_KEY: process.env.SESSION_KEY || 'superSessionSercetKey'
}