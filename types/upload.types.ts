export type MediaTab = 'Image' | 'Video' | 'Text' | 'Audio';

export interface PickedMedia {
    uri: string;
    type: 'image' | 'video' | 'audio';
    fileName?: string;
    fileSize?: number;
    duration?: number;
}