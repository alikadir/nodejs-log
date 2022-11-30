import { faker } from '@faker-js/faker';

export let users = [];

for (let i = 0; i < 50; i++) {
  users.push({
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    userName: faker.internet.userName(),
    age: faker.random.numeric(2),
    avatar: faker.image.avatar(),
    email: faker.internet.email(),
    birthDate: faker.date.past(),
  });
}


