import { crashLog } from "../services/crashMonitor"

/**
 * Lightweight native-ad prefetch pool.
 *
 * In a real implementation you would call
 *   NativeAd.createForAdRequest(NativeAdId)
 * from react-native-google-mobile-ads.  Since that requires the SDK to be
 * initialised and a real ad-unit ID, this pool uses opaque tokens
 * (simple objects with an `id` and a `createdAt` timestamp) as
 * placeholders.  The consuming hook (useNativeAdFromPool) or NativeAd
 * component can treat the token as a "reservation" and request a real
 * native ad view at render time.
 *
 * Swap the token creation in `_createAd()` for a real SDK call when you
 * wire up native ads.
 */

export interface NativeAdToken {
    id: string;
    createdAt: number;
}

type PoolListener = () => void;

const POOL_SIZE = 2;

class NativeAdPoolManager {
    private pool: NativeAdToken[] = [];
    private listeners: Set<PoolListener> = new Set();
    private running = false;
    private canCreate: (() => boolean) | null = null;

    // ── public API ──────────────────────────────────────────────────────────

    start(canCreateAds: () => boolean): void {
        this.canCreate = canCreateAds;
        this.running = true;
        crashLog('[NativeAdPool] started');
        this._refill();
    }

    stop(): void {
        this.running = false;
        this.canCreate = null;
        this.pool = [];
        crashLog('[NativeAdPool] stopped');
    }

    acquire(): NativeAdToken | null {
        const token = this.pool.shift() ?? null;
        if (token) {
            crashLog(`[NativeAdPool] acquired ${token.id}  (remaining: ${this.pool.length})`);
            this._refill();          // start refilling in the background
        }
        return token;
    }

    subscribe(callback: PoolListener): () => void {
        this.listeners.add(callback);
        return () => {
            this.listeners.delete(callback);
        };
    }

    get size(): number {
        return this.pool.length;
    }

    // ── internals ───────────────────────────────────────────────────────────

    private _refill(): void {
        if (!this.running) return;
        if (!this.canCreate || !this.canCreate()) return;

        while (this.pool.length < POOL_SIZE) {
            const token = this._createAd();
            this.pool.push(token);
            crashLog(`[NativeAdPool] prefetched ${token.id}  (pool: ${this.pool.length})`);
        }

        this._notify();
    }

    private _createAd(): NativeAdToken {
        // TODO: Replace with a real NativeAd.createForAdRequest() call once
        //       your NativeAd component is wired to the SDK.
        return {
            id: `native_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: Date.now(),
        };
    }

    private _notify(): void {
        this.listeners.forEach((cb) => {
            try {
                cb();
            } catch (_) { }
        });
    }
}

/** Singleton instance — import this everywhere. */
export const nativeAdPool = new NativeAdPoolManager();