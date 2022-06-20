const Knex = require('knex');

class Contenedor {
    constructor(tableName, config) {
        this.table = tableName,
        this.knex = Knex(config)
    }

    async createProdsTable() {
        await this.knex.schema.dropTableIfExists(this.table);
        await this.knex.schema.createTable(this.table, (table) => {
            table.string("title", 20).notNullable();
            table.integer("price").notNullable();
            table.string("img").notNullable();
        })
    }

    async createChatTable() {
        await this.knex.schema.dropTableIfExists(this.table);
        await this.knex.schema.createTable("chat", (table) => {
            table.string("message", 300).notNullable();
            table.increments("id", { primaryKey: true });
        })
    }

    async getChat() {
        const chat = await this.knex(this.table).select("*")
        return chat
    }

    async addMessage(message) {
        await this.knex(this.table).insert({ message });
    }

    async addItem({ title, price, img }) {
        console.log("agregando", title, price, img);
        await this.knex(this.table).insert({ title, price, img });
    }

    async getProducts() {
        const prods = await this.knex(this.table).select("*")
        return prods;
    }

    async findProduct(id) {
        await this.knex(this.table).select("*").then((productos) => {
            productos.find((item) => {
                return item.id === id;
            })
        })
    }

    async updateProduct(id_, producto) {
        const index = await this.knex(this.table).select("*").then((productos) => {
            productos.findIndex((item) => item.id === id);
            if (index !== -1) {
                const update = async () => {
                    await this.knex(this.table).where("id", id_).update({ title: producto.title, price: producto.price, img: producto.img });
                    return true;
                }
                update();
            } else {
                return false;
            }
        })
    }

    async deleteProduct(id) {
        const index = await this.knex(this.table).select("*").then((productos) => {
            productos.findIndex((item) => item.id === id);
            if (index !== -1) {
                const deleteProd = async () => {
                    await this.knex(this.table).where("id", id).del();
                    return true
                }
                deleteProd()
            } else {
                return false;
            }
        })
    }
}

module.exports = Contenedor;