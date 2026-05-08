import { faker } from "@faker-js/faker";

export interface MerchantFactoryOutput {
  merchantName: string;
  timezone: string;
  category: string;
  contact: {
    name: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    zipCode: string;
    address: string;
  };
  business: {
    phone: string;
    state: string;
    city: string;
    zipCode: string;
    areaCode: string;
    address: string;
  };
}

export const MerchantFactory = {
  build(overrides: Partial<MerchantFactoryOutput> = {}): MerchantFactoryOutput {
    const state = faker.location.state({ abbreviated: true });
    const city = faker.location.city();
    return {
      merchantName:
        overrides.merchantName ?? `Test Merchant ${faker.string.alphanumeric(6).toUpperCase()}`,
      timezone: overrides.timezone ?? "(GMT-08:00) Pacific Time (US & Canada)",
      category: overrides.category ?? "Restaurants",
      contact: overrides.contact ?? {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email().toLowerCase(),
        city,
        state,
        zipCode: faker.location.zipCode("#####"),
        address: faker.location.streetAddress(),
      },
      business: overrides.business ?? {
        phone: faker.phone.number(),
        state,
        city,
        zipCode: faker.location.zipCode("#####"),
        areaCode: faker.string.numeric(3),
        address: faker.location.streetAddress(),
      },
    };
  },
};
