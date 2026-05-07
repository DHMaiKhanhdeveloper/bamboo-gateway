import { faker } from "@faker-js/faker";
import { CardFactory } from "~/data/factories/card.factory";

export interface CustomerFactoryOutput {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description?: string;
  card: ReturnType<typeof CardFactory.valid>;
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
    phone: string;
    company?: string;
  };
}

export const CustomerFactory = {
  build(overrides: Partial<CustomerFactoryOutput> = {}): CustomerFactoryOutput {
    const firstName = overrides.firstName ?? faker.person.firstName();
    const lastName = overrides.lastName ?? faker.person.lastName();
    return {
      customerId: overrides.customerId ?? `CUST-${faker.string.alphanumeric(8).toUpperCase()}`,
      firstName,
      lastName,
      email: overrides.email ?? faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: overrides.phone ?? faker.phone.number(),
      description: overrides.description ?? faker.lorem.sentence(),
      card: overrides.card ?? CardFactory.valid(),
      billingAddress: overrides.billingAddress ?? {
        firstName,
        lastName,
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip: faker.location.zipCode("#####"),
        country: "United States of America (USA)",
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number(),
        company: faker.company.name(),
      },
    };
  },
};
