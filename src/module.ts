import { HarkSpeechProvider } from "./scripts/hark_speech_provider";
import { VRTManager } from "./scripts/manager";

const harkerSpeechProvider = new HarkSpeechProvider;
VRTManager.run(harkerSpeechProvider);