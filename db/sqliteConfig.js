const sqlite = {
    client: "sqlite3",
    connection: {
        filename: "./db/ecommerce.sqlite3",
    },
    useNullAsDefault: true
}
module.exports = sqlite;