import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MERCHANT_DATA_PATH = path.resolve(__dirname, "../data/seeds/merchant.json");

export interface MerchantData {
  tsysMerchant: string;
  demoMerchant: string;
  selectedMerchantId?: string;
  commonMerchantId?: string;
  userId?: string;
  [key: string]: string | undefined;
}

export function readMerchantData(): MerchantData {
  const raw = fs.readFileSync(MERCHANT_DATA_PATH, "utf-8");
  return JSON.parse(raw) as MerchantData;
}

export function saveMerchantId(key: string, merchantId: string): void {
  const data = readMerchantData();
  data[key] = merchantId;
  fs.writeFileSync(MERCHANT_DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.info(`Saved merchant ID for '${key}': ${merchantId}`);
}

export function getMerchantId(key: string): string | undefined {
  return readMerchantData()[key];
}

export function merchantIdExists(merchantId: string): boolean {
  return Object.values(readMerchantData()).includes(merchantId);
}

export function hasMerchantKey(key: string): boolean {
  const data = readMerchantData();
  return key in data && Boolean(data[key]);
}

export function getFastboyPaymentsMerchantId(): string | undefined {
  return getMerchantId("fastboyPaymentsMerchant");
}
