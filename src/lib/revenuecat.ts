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
const REVENUECAT_ANDROID_API_KEY = "goog_ESwasGhWrmTvFWGjIEzbJHNAbyT";

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

/* ------------------------------------------------------------------ *
 * MedAd Lite ($29 / lună, Android only, Google Play Billing)
 * Product id: medad_pro_monthly · Offering: "default"
 * Entitlement: "medad_compliance_ai_pro"
 * Nu afectează în niciun fel fluxurile web Stripe ($49 / $149).
 * ------------------------------------------------------------------ */

export const LITE_ENTITLEMENT_ID = "medad_compliance_ai_pro";
export const LITE_OFFERING_ID = "default";
export const LITE_PRODUCT_ID = "medad_pro_monthly";

/** Limite specifice tier-ului MedAd Lite. */
export const LITE_GENERATION_LIMIT = 15;
export const LITE_VARIATIONS_PER_RUN = 1;

/**
 * Găsește pachetul lunar MedAd Lite din offering-ul "default".
 * Returnează null pe web sau dacă offering-ul nu este disponibil.
 */
export async function getLiteMonthlyPackage(): Promise<PurchasesPackage | null> {
  const offerings = await getOfferings();
  if (!offerings) return null;

  const offering = offerings.all?.[LITE_OFFERING_ID] ?? offerings.current ?? null;
  if (!offering) return null;

  const packages = offering.availablePackages ?? [];
  return (
    packages.find((p) => p.product?.identifier?.includes(LITE_PRODUCT_ID)) ??
    packages.find((p) => p.identifier?.toLowerCase().includes("month")) ??
    packages[0] ??
    null
  );
}

/** Verifică dacă entitlement-ul MedAd Lite este activ (restore la pornire). */
export async function checkLiteEntitlement(): Promise<boolean> {
  if (!isNativeAndroid()) return false;

  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return Boolean(customerInfo.entitlements.active?.[LITE_ENTITLEMENT_ID]);
  } catch (error) {
    console.error("checkLiteEntitlement failed:", error);
    return false;
  }
}
