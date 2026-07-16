// hooks/ads/useNativeAdFromPool.ts
import { useState, useEffect } from 'react';
import { nativeAdPool } from '../../services/nativeAdPool';

export const useNativeAdFromPool = () => {
    const [adItem, setAdItem] = useState<any>(null);
    const [poolSize, setPoolSize] = useState(0);

    useEffect(() => {
        const unsubscribe = nativeAdPool.subscribe(() => {
            setPoolSize(nativeAdPool.size);
        });

        const item = nativeAdPool.acquire();
        if (item) setAdItem(item);

        return unsubscribe;
    }, []);

    return { adItem, poolSize };
};