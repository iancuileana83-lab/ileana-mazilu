import { useCallback, useEffect, useState } from "react";
import {
  LITE_ENTITLEMENT_ID,
  LITE_GENERATION_LIMIT,
  getLiteMonthlyPackage,
  initRevenueCat,
  isNativeAndroid,
  purchasePackage,
  restorePurchases,
  checkLiteEntitlement,
} from "@/lib/revenuecat";
import type { PurchasesPackage } from "@revenuecat/purchases-capacitor";

/**
 * Cheia de uz lunar pentru tier-ul MedAd Lite (Android / RevenueCat).
 * Web (Stripe $49 / $149) NU folosește acest contor.
 */
const USAGE_KEY = "medad_lite_usage";

function currentPeriod(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function readUsage(): number {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { period?: string; count?: number };
    if (parsed.period !== currentPeriod()) return 0;
    return Math.max(0, parsed.count ?? 0);
  } catch {
    return 0;
  }
}

function writeUsage(count: number) {
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify({ period: currentPeriod(), count }));
  } catch {
    /* ignore storage errors */
  }
}

export interface MedAdLiteState {
  /** true doar în aplicația nativă Android (Capacitor). */
  isAndroid: boolean;
  /** true dacă entitlement-ul medad_compliance_ai_pro este activ. */
  isLite: boolean;
  loading: boolean;
  error: string | null;
  /** Pachetul lunar $29 din offering-ul "default". */
  litePackage: PurchasesPackage | null;
  priceString: string | null;
  /** Generări folosite luna aceasta (doar Lite). */
  used: number;
  limit: number;
  remaining: number;
  atLimit: boolean;
  registerGeneration: () => void;
  buyLite: () => Promise<void>;
  restore: () => Promise<void>;
}

/**
 * Gating pentru tier-ul MedAd Lite ($29 / lună, Android only).
 * Pe web returnează isAndroid = false și isLite = false, astfel încât
 * fluxurile existente Stripe ($49 Starter / $149 Agency) rămân neatinse.
 */
export function useMedAdLite(): MedAdLiteState {
  const android = isNativeAndroid();
  const [isLite, setIsLite] = useState(false);
  const [loading, setLoading] = useState(android);
  const [error, setError] = useState<string | null>(null);
  const [litePackage, setLitePackage] = useState<PurchasesPackage | null>(null);
  const [used, setUsed] = useState(0);

  useEffect(() => {
    if (!android) return;
    setUsed(readUsage());

    let cancelled = false;
    (async () => {
      try {
        await initRevenueCat();
        // Restaurează accesul dacă utilizatorul este deja abonat.
        const active = await checkLiteEntitlement();
        const pkg = await getLiteMonthlyPackage();
        if (cancelled) return;
        setIsLite(active);
        setLitePackage(pkg);
      } catch {
        if (!cancelled) setError("Statusul abonamentului nu a putut fi verificat momentan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [android]);

  const registerGeneration = useCallback(() => {
    if (!android || !isLite) return;
    const next = readUsage() + 1;
    writeUsage(next);
    setUsed(next);
  }, [android, isLite]);

  const buyLite = useCallback(async () => {
    if (!android || !litePackage) return;
    setError(null);
    setLoading(true);
    const result = await purchasePackage(litePackage);
    if (result.success) {
      const active = Boolean(result.customerInfo.entitlements.active?.[LITE_ENTITLEMENT_ID]);
      setIsLite(active);
      if (!active) setError("Abonamentul a fost înregistrat, dar accesul nu s-a activat încă. Încearcă „Restore”.");
    } else if (!result.cancelled) {
      setError(result.error);
    }
    setLoading(false);
  }, [android, litePackage]);

  const restore = useCallback(async () => {
    if (!android) return;
    setError(null);
    setLoading(true);
    const status = await restorePurchases();
    setIsLite(status.entitlements.includes(LITE_ENTITLEMENT_ID));
    if (status.error) setError(status.error);
    setLoading(false);
  }, [android]);

  const limit = LITE_GENERATION_LIMIT;
  const remaining = Math.max(0, limit - used);

  return {
    isAndroid: android,
    isLite,
    loading,
    error,
    litePackage,
    priceString: litePackage?.product?.priceString ?? null,
    used,
    limit,
    remaining,
    atLimit: isLite && used >= limit,
    registerGeneration,
    buyLite,
    restore,
  };
}
