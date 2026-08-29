import { Capacitor } from "@capacitor/core";
import {
  Purchases,
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from "@revenuecat/purchases-capacitor";

/**
 * Cheia publică RevenueCat pentru Android (Google Play Billing).
 * Se completează cu cheia "Public SDK Key" din RevenueCat Dashboard
 * (Project Settings → API Keys → app-ul Android). Nu este un secret.
 */
const REVENUECAT_ANDROID_API_KEY = "goog_REPLACE_WITH_REVENUECAT_ANDROID_API_KEY";

/** Entitlement-ul care marchează un abonament activ (configurat în RevenueCat). */
export const PREMIUM_ENTITLEMENT_ID = "premium";

export interface SubscriptionStatus {
  isActive: boolean;
  activeEntitlements: string[];
  error?: string;
}

let configured = false;

/**
 * Returnează true doar pe platforma nativă Android.
 * RevenueCat / Google Play Billing nu se folosește în browser/web
 * (acolo rămâne Stripe).
 */
export function isNativeAndroid(): boolean {
  try {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
  } catch {
    return false;
  }
}

/**
 * Configurează SDK-ul RevenueCat o singură dată, la pornirea aplicației.
 * Apelat din App.tsx; pe web nu face nimic.
 */
export async function initRevenueCat(): Promise<void> {
  if (!isNativeAndroid()) return;
  if (configured) return;

  try {
    await Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY });
    configured = true;
  } catch (error) {
    console.error("RevenueCat init failed:", error);
  }
}

/**
 * Aduce ofertele/pachetele disponibile din RevenueCat.
 * Returnează null pe web sau la eroare.
 */
export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (!isNativeAndroid()) return null;

  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error("getOfferings failed:", error);
    return null;
  }
}

export type PurchaseResult =
  | { success: true; customerInfo: CustomerInfo }
  | { success: false; cancelled: true }
  | { success: false; cancelled: false; error: string };

/**
 * Inițiază cumpărarea unui pachet selectat prin Google Play Billing.
 * Gestionează și cazul în care utilizatorul anulează plata.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<PurchaseResult> {
  if (!isNativeAndroid()) {
    return { success: false, cancelled: false, error: "Achizițiile in-app sunt disponibile doar în aplicația Android." };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return { success: true, customerInfo };
  } catch (error) {
    const err = error as { userCancelled?: boolean; message?: string };
    if (err?.userCancelled) {
      return { success: false, cancelled: true };
    }
    console.error("purchasePackage failed:", error);
    return {
      success: false,
      cancelled: false,
      error: "Plata nu a putut fi finalizată. Te rugăm să încerci din nou.",
    };
  }
}

/**
 * Verifică dacă utilizatorul curent are un abonament activ,
 * pe baza entitlements-urilor din CustomerInfo.
 */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  if (!isNativeAndroid()) {
    return { isActive: false, activeEntitlements: [] };
  }

  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const active = Object.keys(customerInfo.entitlements.active ?? {});
    return {
      isActive: Boolean(customerInfo.entitlements.active?.[PREMIUM_ENTITLEMENT_ID]),
      activeEntitlements: active,
    };
  } catch (error) {
    console.error("checkSubscriptionStatus failed:", error);
    return {
      isActive: false,
      activeEntitlements: [],
      error: "Statusul abonamentului nu a putut fi verificat momentan.",
    };
  }
}

/**
 * Restaurează achizițiile anterioare ale utilizatorului (cerut de Google Play).
 */
export async function restorePurchases(): Promise<SubscriptionStatus> {
  if (!isNativeAndroid()) {
    return { isActive: false, activeEntitlements: [] };
  }

  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const active = Object.keys(customerInfo.entitlements.active ?? {});
    return {
      isActive: Boolean(customerInfo.entitlements.active?.[PREMIUM_ENTITLEMENT_ID]),
      activeEntitlements: active,
    };
  } catch (error) {
    console.error("restorePurchases failed:", error);
    return {
      isActive: false,
      activeEntitlements: [],
      error: "Achizițiile nu au putut fi restaurate momentan.",
    };
  }
}
