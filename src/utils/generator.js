import faker from "faker";
faker.locale = "es";

export const get = () => ({
  title: faker.commerce.product(),
  detail: faker.commerce.productDescription(),
  brand: faker.company.companyName(),
  code: faker.vehicle.vrm(),
  category: faker.commerce.department(),
  price: faker.commerce.price(),
  stock: faker.datatype.number(100),
  thumbnail: faker.image.imageUrl()
});
