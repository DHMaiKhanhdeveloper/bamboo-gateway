/**
 * Static factory class with deterministic test data + simple randomizers.
 * For richer/realistic data use the factories under `src/data/factories/*`.
 */
export class DataGenerator {
  // ---------------------------------------------------------------------------
  // Card data
  // ---------------------------------------------------------------------------
  static generateValidCardNumber(): string {
    return "4111111111111111";
  }
  static generateInvalidCardNumber(): string {
    return "4000000000009995";
  }
  static generateExpiredCardNumber(): string {
    return "4111111111111111";
  }
  static generateInsufficientFundsCardNumber(): string {
    return "4000000000000002";
  }

  static generateValidExpDate(): string {
    const futureYear = new Date().getFullYear() + 2;
    return `12/${String(futureYear).slice(-2)}`;
  }

  static generateExpiredExpDate(): string {
    return "01/20";
  }
  static generateInvalidExpDate(): string {
    return "13/34";
  }

  static generateValidCvv(): string {
    return "123";
  }
  static generateInvalidCvv(): string {
    return "999";
  }

  // ---------------------------------------------------------------------------
  // Amounts
  // ---------------------------------------------------------------------------
  static generateValidAmount(): string {
    return (Math.random() * 1000 + 10).toFixed(2);
  }
  static generateZeroAmount(): string {
    return "0";
  }
  static generateHighAmount(): string {
    return "999999";
  }
  static generateDecimalAmount(): string {
    return "99.99";
  }
  static generateNegativeAmount(): string {
    return "-50.00";
  }

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------
  static generateRandomEmail(): string {
    const domains = ["test.com", "example.com", "demo.org"] as const;
    const r = Math.random().toString(36).substring(2, 10);
    const idx = Math.floor(Math.random() * domains.length);
    return `${r}@${domains[idx] ?? domains[0]}`;
  }

  static generateRandomUsername(): string {
    return "user_" + Math.random().toString(36).substring(2, 10);
  }

  static generateRandomPassword(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    return pwd;
  }

  // ---------------------------------------------------------------------------
  // Transaction
  // ---------------------------------------------------------------------------
  static generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Generate a UUID v7 (timestamp-based, RFC 9562).
   */
  static generateUUIDv7(): string {
    const timestamp = Date.now();
    const tsHex = timestamp.toString(16).padStart(12, "0");

    const random = new Uint8Array(10);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(random);
    } else {
      for (let i = 0; i < 10; i++) random[i] = Math.floor(Math.random() * 256);
    }

    const part1 = tsHex.substring(0, 8);
    const part2 = tsHex.substring(8, 12);
    const part3 =
      "7" +
      Array.from(random.slice(0, 2))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .substring(1, 4);
    const variantByte = ((random[2] ?? 0) & 0x3f) | 0x80;
    const part4 =
      variantByte.toString(16).padStart(2, "0") + (random[3] ?? 0).toString(16).padStart(2, "0");
    const part5 = Array.from(random.slice(4, 10))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
  }

  static generateTerminalId(): string {
    return "0199195d-afb4-7f8f-b957-57a9ca76e7d9";
  }

  // ---------------------------------------------------------------------------
  // Composite payment data
  // ---------------------------------------------------------------------------
  static generateValidPaymentData(): {
    amount: string;
    cardNumber: string;
    expDate: string;
    cvv: string;
  } {
    return {
      amount: this.generateValidAmount(),
      cardNumber: this.generateValidCardNumber(),
      expDate: this.generateValidExpDate(),
      cvv: this.generateValidCvv(),
    };
  }

  static generateInvalidPaymentData(): {
    amount: string;
    cardNumber: string;
    expDate: string;
    cvv: string;
  } {
    return {
      amount: this.generateValidAmount(),
      cardNumber: this.generateInvalidCardNumber(),
      expDate: this.generateValidExpDate(),
      cvv: this.generateValidCvv(),
    };
  }

  static generateExpiredCardPaymentData(): {
    amount: string;
    cardNumber: string;
    expDate: string;
    cvv: string;
  } {
    return {
      amount: this.generateValidAmount(),
      cardNumber: this.generateExpiredCardNumber(),
      expDate: this.generateExpiredExpDate(),
      cvv: this.generateValidCvv(),
    };
  }

  static generateInsufficientFundsPaymentData(): {
    amount: string;
    cardNumber: string;
    expDate: string;
    cvv: string;
  } {
    return {
      amount: this.generateValidAmount(),
      cardNumber: this.generateInsufficientFundsCardNumber(),
      expDate: this.generateValidExpDate(),
      cvv: this.generateValidCvv(),
    };
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------
  static getRandomItem<T>(array: T[]): T {
    if (array.length === 0) throw new Error("getRandomItem: empty array");
    return array[Math.floor(Math.random() * array.length)] as T;
  }

  static generateRandomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++)
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  }

  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ---------------------------------------------------------------------------
  // Test scenarios
  // ---------------------------------------------------------------------------
  static getTestScenarios() {
    return {
      validPayment: this.generateValidPaymentData(),
      invalidCard: this.generateInvalidPaymentData(),
      expiredCard: this.generateExpiredCardPaymentData(),
      insufficientFunds: this.generateInsufficientFundsPaymentData(),
      zeroAmount: { ...this.generateValidPaymentData(), amount: this.generateZeroAmount() },
      highAmount: { ...this.generateValidPaymentData(), amount: this.generateHighAmount() },
      decimalAmount: { ...this.generateValidPaymentData(), amount: this.generateDecimalAmount() },
    };
  }
}
