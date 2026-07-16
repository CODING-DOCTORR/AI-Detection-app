import { useEffect, useRef, useState } from "react";
import { NativeAd } from "react-native-google-mobile-ads";
import { nativeAdPool } from "@/services/nativeAdPool";

export function useNativeAdFromPool(
  enabled: boolean,
  placement: string = "unknown"
): NativeAd | null {
  const [ad, setAd] = useState<NativeAd | null>(null);
  const claimedRef = useRef<NativeAd | null>(null);
  const mountedAtRef = useRef<number>(Date.now());
  const waitedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      if (claimedRef.current) {
        console.log(
          `[NativeAd:${placement}] released (disabled) after ${
            Date.now() - mountedAtRef.current
          }ms`
        );
        claimedRef.current.destroy?.();
        claimedRef.current = null;
      }
      setAd(null);
      return;
    }

    mountedAtRef.current = Date.now();
    waitedRef.current = false;

    const tryAcquire = () => {
      if (claimedRef.current) return;
      const next = nativeAdPool.acquire();
      if (next) {
        const waitMs = Date.now() - mountedAtRef.current;
        console.log(
          `[NativeAd:${placement}] 📥 acquired (waited=${waitMs}ms, ${
            waitedRef.current ? "COLD" : "WARM"
          })`
        );
        claimedRef.current = next;
        setAd(next);
      } else if (!waitedRef.current) {
        waitedRef.current = true;
        console.log(
          `[NativeAd:${placement}] ⏳ waiting for pool refill...`
        );
      }
    };

    tryAcquire();
    const unsub = nativeAdPool.subscribe(tryAcquire);

    return () => {
      unsub();
      if (claimedRef.current) {
        claimedRef.current.destroy?.();
        claimedRef.current = null;
      }
    };
  }, [enabled, placement]);

  return ad;
}
