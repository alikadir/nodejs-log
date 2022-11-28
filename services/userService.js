import faker from 'faker';

export let users = [];

for (let i = 0; i < 50; i++) {
  users.push({
    id: faker.random.number(999),
    name: faker.name.findName(),
    userName: faker.internet.userName(),
    age: faker.random.number(99),
    email: faker.internet.email(),
    birthDate: faker.date.past(),
  });
}
