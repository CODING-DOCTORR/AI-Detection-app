// services/historyService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@deepfake_history';

export interface HistoryItem {
    id: string;
    fileName: string;
    date: string;              // "Oct 12, 2026"
    time: string;              // "14:30"
    timestamp: number;         // Date.now() for sorting/grouping
    type: 'video' | 'image' | 'audio' | 'text' | 'document';
    mode: 'Deepfake' | 'AI';   // Detection mode
    detectionLabel: string;    // "Deepfake Video", "AI Text", etc.
    isAuthentic: boolean;
    percentage: number;
    rawResult?: any;           // Full API response (for viewing later)
}

// ═══════════════════════════════════════════════════════════════
// PARSE API RESULT → { isAuthentic, percentage }
// ═══════════════════════════════════════════════════════════════
export const parseResult = (
    result: any,
    mode: 'Deepfake' | 'AI',
    type: string
): { isAuthentic: boolean; percentage: number } => {
    if (!result) return { isAuthentic: false, percentage: 0 };

    const safeNum = (val: any): number => {
        if (val === null || val === undefined || isNaN(Number(val))) return 0;
        return Number(val);
    };

    // ── AI TEXT DETECTION ──
    if (mode === 'AI' && type === 'Text') {
        const aiPct = safeNum(
            result.ai_generated_pct ??
            result.p_ai_pct ??
            result.ai_pct ??
            result.p_fake_pct ??
            (result.ai_score ? result.ai_score * 100 : 0)
        );
        const humanPct = safeNum(
            result.human_written_pct ??
            result.p_human_pct ??
            result.human_pct ??
            result.p_real_pct ??
            (100 - aiPct)
        );

        const isAuthentic = humanPct > aiPct;
        const percentage = Math.max(humanPct, aiPct);
        return { isAuthentic, percentage: parseFloat(percentage.toFixed(1)) };
    }

    // ── DEEPFAKE / AI MEDIA DETECTION ──
    const fakePct = safeNum(
        result.p_fake_pct ??
        result.fake_pct ??
        result.deepfake_pct ??
        result.ai_generated_pct ??
        (result.label === 'fake' || result.label === 'ai' || result.label === 'deepfake'
            ? safeNum(result.confidence_pct)
            : 0)
    );

    const realPct = safeNum(
        result.p_real_pct ??
        result.real_pct ??
        result.authentic_pct ??
        result.human_written_pct ??
        (100 - fakePct)
    );

    const isFake =
        result.label === 'fake' ||
        result.label === 'ai' ||
        result.label === 'deepfake' ||
        fakePct > 50;

    const isAuthentic = !isFake;
    const percentage = safeNum(result.confidence_pct || Math.max(fakePct, realPct));

    return { isAuthentic, percentage: parseFloat(percentage.toFixed(1)) };
};

// ═══════════════════════════════════════════════════════════════
// GET ALL HISTORY (sorted newest first)
// ═══════════════════════════════════════════════════════════════
export const getHistory = async (): Promise<HistoryItem[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const items: HistoryItem[] = JSON.parse(data);
        return items.sort((a, b) => b.timestamp - a.timestamp); // Newest first
    } catch (e) {
        console.log('Error loading history:', e);
        return [];
    }
};

// ═══════════════════════════════════════════════════════════════
// ADD A NEW HISTORY ITEM
// ═══════════════════════════════════════════════════════════════
export interface AddHistoryParams {
    fileName?: string;
    mode: 'Deepfake' | 'AI';
    type: string;                        // 'Image', 'Video', 'Text', 'Audio'
    result: any;                         // Raw API response
    textPreview?: string;                // For text analysis, first few words
}

export const addHistoryItem = async (params: AddHistoryParams): Promise<HistoryItem> => {
    const { fileName, mode, type, result, textPreview } = params;
    const now = new Date();
    const timestamp = now.getTime();

    // Format date & time
    const date = now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    }); // "Oct 12, 2026"

    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }); // "14:30"

    // Generate file name based on type
    let finalFileName = fileName || '';
    if (!finalFileName) {
        if (type === 'Text' && textPreview) {
            // Use first 30 chars of text
            finalFileName = textPreview.slice(0, 30).trim() + (textPreview.length > 30 ? '...' : '');
        } else {
            finalFileName = `${mode}_${type}_${timestamp}`;
        }
    }

    // Determine icon type
    let iconType: HistoryItem['type'] = 'document';
    const typeLower = type.toLowerCase();
    if (typeLower === 'image') iconType = 'image';
    else if (typeLower === 'video') iconType = 'video';
    else if (typeLower === 'audio') iconType = 'audio';
    else if (typeLower === 'text') iconType = 'text';

    // Parse result
    const { isAuthentic, percentage } = parseResult(result, mode, type);

    const newItem: HistoryItem = {
        id: `${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
        fileName: finalFileName,
        date,
        time,
        timestamp,
        type: iconType,
        mode,
        detectionLabel: `${mode} ${type}`,
        isAuthentic,
        percentage,
        rawResult: result,
    };

    try {
        const existing = await getHistory();
        const updated = [newItem, ...existing];
        // Keep only latest 100 items
        const trimmed = updated.slice(0, 100);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        console.log('✅ History item added:', newItem.fileName);
        return newItem;
    } catch (e) {
        console.log('Error adding history:', e);
        return newItem;
    }
};

// ═══════════════════════════════════════════════════════════════
// DELETE A SINGLE HISTORY ITEM
// ═══════════════════════════════════════════════════════════════
export const deleteHistoryItem = async (id: string): Promise<void> => {
    try {
        const existing = await getHistory();
        const filtered = existing.filter((item) => item.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        console.log('🗑️ History item deleted:', id);
    } catch (e) {
        console.log('Error deleting history:', e);
    }
};

// ═══════════════════════════════════════════════════════════════
// CLEAR ALL HISTORY
// ═══════════════════════════════════════════════════════════════
export const clearHistory = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log('🗑️ All history cleared');
    } catch (e) {
        console.log('Error clearing history:', e);
    }
};

// ═══════════════════════════════════════════════════════════════
// GROUP HISTORY BY DATE SECTION (TODAY / YESTERDAY / MONTH YEAR)
// ═══════════════════════════════════════════════════════════════
export interface HistorySection {
    sectionTitle: string;
    data: HistoryItem[];
}

export const groupHistoryByDate = (items: HistoryItem[]): HistorySection[] => {
    if (items.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 24 * 60 * 60 * 1000;

    const sections: Record<string, HistoryItem[]> = {};

    items.forEach((item) => {
        const itemDate = new Date(item.timestamp);
        const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();

        let sectionKey: string;
        if (itemDay === today) {
            sectionKey = 'TODAY';
        } else if (itemDay === yesterday) {
            sectionKey = 'YESTERDAY';
        } else {
            sectionKey = itemDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
            }).toUpperCase(); // "OCTOBER 2026"
        }

        if (!sections[sectionKey]) sections[sectionKey] = [];
        sections[sectionKey].push(item);
    });

    // Preserve order: TODAY → YESTERDAY → other sections (newest first)
    const orderedSections: HistorySection[] = [];
    if (sections['TODAY']) {
        orderedSections.push({ sectionTitle: 'TODAY', data: sections['TODAY'] });
        delete sections['TODAY'];
    }
    if (sections['YESTERDAY']) {
        orderedSections.push({ sectionTitle: 'YESTERDAY', data: sections['YESTERDAY'] });
        delete sections['YESTERDAY'];
    }

    // Add remaining sections (already in newest-first order)
    Object.keys(sections).forEach((key) => {
        orderedSections.push({ sectionTitle: key, data: sections[key] });
    });

    return orderedSections;
};