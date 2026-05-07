import usersData from "~/data/seeds/users.json" with { type: "json" };

export interface TestUser {
  id: string;
  username: string;
  password: string;
  terminals: string[];
  totpSecret: string;
}

export class UserManager {
  private static readonly users: TestUser[] = usersData.testUsers;

  static getUserByUsername(username: string): TestUser | undefined {
    return this.users.find((u) => u.username === username);
  }

  static getAdminUser(): TestUser {
    return this.requireUser("admin.test", "Admin user");
  }

  static getMerchantUser(): TestUser {
    return this.requireUser("merchant1.test", "Merchant user");
  }

  static getMasterMerchantUser(): TestUser {
    return this.requireUser("master_merchant1.test", "Master merchant user");
  }

  static getSupportUser(): TestUser {
    return this.requireUser("support.test", "Support user");
  }

  static getResellerUser(): TestUser {
    return this.requireUser("reseller.test", "Reseller user");
  }

  static getMasterResellerUser(): TestUser {
    return this.requireUser("master_reseller.test", "Master reseller user");
  }

  static getUsersByPattern(pattern: string): TestUser[] {
    return this.users.filter((u) => u.username.includes(pattern));
  }

  static getMerchantUsers(): TestUser[] { return this.getUsersByPattern("merchant"); }
  static getMasterMerchantUsers(): TestUser[] { return this.getUsersByPattern("master_merchant"); }

  static getUserCredentials(username?: string): {
    username: string;
    password: string;
    totpSecret: string;
  } {
    const user = (username ? this.getUserByUsername(username) : null) ?? this.getAdminUser();
    return {
      username: user.username,
      password: user.password,
      totpSecret: user.totpSecret,
    };
  }

  static getAllUsers(): TestUser[] { return this.users; }
  static getAllUsernames(): string[] { return this.users.map((u) => u.username); }
  static validateUser(username: string): boolean { return this.getUserByUsername(username) !== undefined; }

  static getRandomUser(): TestUser {
    const idx = Math.floor(Math.random() * this.users.length);
    const user = this.users[idx];
    if (!user) throw new Error("No users available");
    return user;
  }

  private static requireUser(username: string, label: string): TestUser {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error(`${label} not found in test data (looking for '${username}')`);
    return user;
  }
}
