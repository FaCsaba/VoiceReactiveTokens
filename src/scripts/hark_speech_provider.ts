import hark from "hark";
import { SpeechEvents, SpeechProvider } from "./speech_provider";


export class HarkSpeechProvider implements SpeechProvider {
    private harker?: hark.Harker;
    private deferredEventSubs: { event: SpeechEvents, fn: () => void }[] = [];

    constructor() {
        // does not wait for harker to be created
        this.deferredCreateHarker();
    }

    public on(event: "speaking" | "stopped_speaking", fn: () => void): void {
        if (this.harker === undefined) {
            this.deferredEventSubs.push({ event, fn });
            return;
        }

        this.harker.on(event, fn);
    }

    private async deferredCreateHarker() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.harker = hark(stream);
        this.registerDeferredEventSubs();
    }

    private registerDeferredEventSubs() {
        this.deferredEventSubs.forEach(e => this.harker!.on(e.event, e.fn));
    }
}