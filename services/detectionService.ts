// services/detectionService.ts
import { Platform } from 'react-native';
import { auth } from '../config/firebase';

const BASE_URL = 'https://api-gateway-265877066756.us-central1.run.app';

// Get fresh Firebase token
const getToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');
    return await user.getIdToken(true); // force refresh
};

// 🔧 Normalize URI for Android (needs file:// prefix)
const normalizeUri = (uri: string): string => {
    if (Platform.OS === 'android' && !uri.startsWith('file://') && !uri.startsWith('content://') && !uri.startsWith('http')) {
        return `file://${uri}`;
    }
    return uri;
};

// 🔧 Auto-detect MIME type from file name
const getImageMimeType = (fileName?: string): string => {
    if (!fileName) return 'image/jpeg';
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'png': return 'image/png';
        case 'webp': return 'image/webp';
        case 'gif': return 'image/gif';
        case 'bmp': return 'image/bmp';
        default: return 'image/jpeg';
    }
};

const getVideoMimeType = (fileName?: string): string => {
    if (!fileName) return 'video/mp4';
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'mov': return 'video/quicktime';
        case 'avi': return 'video/x-msvideo';
        case 'mkv': return 'video/x-matroska';
        default: return 'video/mp4';
    }
};

// 🔧 Universal fetch with better error handling
const uploadFile = async (endpoint: string, formData: FormData): Promise<any> => {
    const token = await getToken();

    console.log(`📤 Uploading to ${endpoint}`);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout

        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                // ⚠️ DO NOT set 'Content-Type' — let fetch set it with the boundary
            },
            body: formData,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ API Error [${res.status}]:`, errorText);

            // Try to parse as JSON for better error messages
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.detail || errorJson.message || errorText);
            } catch {
                throw new Error(errorText || `Server error: ${res.status}`);
            }
        }

        const data = await res.json();
        console.log(`✅ Success [${endpoint}]:`, data);
        return data;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again with a smaller file.');
        }
        if (error.message === 'Network request failed') {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
};

// ============ TEXT DETECTION ============
export const detectText = async (text: string): Promise<any> => {
    const token = await getToken();

    console.log('📤 Sending Text (length):', text.length);

    const res = await fetch(`${BASE_URL}/detect/text`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.detail || errorText);
        } catch {
            throw new Error(errorText);
        }
    }

    const data = await res.json();
    console.log('✅ Text Result:', data);
    return data;
};

// ============ IMAGE DETECTION (AI Generated Check) ============
export const detectImage = async (uri: string, fileName?: string): Promise<any> => {
    const normalizedUri = normalizeUri(uri);
    const mimeType = getImageMimeType(fileName);
    const name = fileName || `image_${Date.now()}.jpg`;

    const formData = new FormData();
    formData.append('file', {
        uri: normalizedUri,
        name,
        type: mimeType,
    } as any);

    console.log('📸 Image details:', { uri: normalizedUri, name, type: mimeType });
    return await uploadFile('/detect/image', formData);
};

// ============ DEEPFAKE IMAGE DETECTION ============
export const detectDeepfakeImage = async (uri: string, fileName?: string): Promise<any> => {
    const normalizedUri = normalizeUri(uri);
    const mimeType = getImageMimeType(fileName);
    const name = fileName || `deepfake_${Date.now()}.jpg`;

    const formData = new FormData();
    formData.append('file', {
        uri: normalizedUri,
        name,
        type: mimeType,
    } as any);

    console.log('🎭 Deepfake Image details:', { uri: normalizedUri, name, type: mimeType });
    return await uploadFile('/detect/deepfake-image', formData);
};

// ============ DEEPFAKE VIDEO DETECTION ============
export const detectDeepfakeVideo = async (uri: string, fileName?: string): Promise<any> => {
    const normalizedUri = normalizeUri(uri);
    const mimeType = getVideoMimeType(fileName);
    const name = fileName || `video_${Date.now()}.mp4`;

    const formData = new FormData();
    formData.append('file', {
        uri: normalizedUri,
        name,
        type: mimeType,
    } as any);

    console.log('🎬 Video details:', { uri: normalizedUri, name, type: mimeType });
    return await uploadFile('/detect/deepfake-video', formData);
};