export type SpeechEvents = 'speaking' | 'stopped_speaking';

export interface SpeechProvider {
    on(event: SpeechEvents, fn: () => void): void;
}