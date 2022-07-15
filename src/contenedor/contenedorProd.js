import { faker } from "@faker-js/faker";

export class ContenedorP {
  constructor() {}
  generarProductos() {
    faker.setLocale('es');
    return {
      id: faker.database.mongodbObjectId(),
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(100, 5000, 0, "$"),
      descripcion: faker.commerce.productDescription(),
      imagen: faker.image.imageUrl(),
      stock: faker.random.numeric(3),
      codigo: faker.random.alphaNumeric(5),
      timestamp: faker.date.past().toISOString(),
    };
  }
}
