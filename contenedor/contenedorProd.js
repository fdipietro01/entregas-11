import { faker } from "@faker-js/faker";

export class ContenedorP {
  constructor() {}

  generarProductos() {
    return {
      id: faker.database.mongodbObjectId(),
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(100, 5000, "$"),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      stock: faker.random.numeric(3),
      cosigo: faker.random.alphaNumeric(5),
      timestamp: faker.date.past().toISOString(),
    };
  }
}
