import { VRTAssociationSettings } from "./settings";
import { VRT_CONST, VRT_TranslationKeys, VRTModuleData } from "./shared";
import { VRTSocketHandler } from "./socket_handler";
import { SpeechProvider } from "./speech_provider";

export class VRTManager {
    private static readonly TokenUpdatePropertyKey = "texture.tint";
    private static readonly NonSpeakingTint = 0x666666;
    private static readonly SpeakingTint = 0xffffff;

    private controlledTokens: Token[] = [];

    private constructor(private speechProvider: SpeechProvider) { }

    public static run(speechProvider: SpeechProvider) {
        const vrt = new VRTManager(speechProvider);
        vrt.registerCallbacks();
    }

    private registerCallbacks() {
        Hooks.once("ready", this.readyCallback.bind(this));
        Hooks.on(VRT_CONST.AssociationChanged, this.associationChangedCallback.bind(this));
        this.speechProvider.on("speaking", this.speakingCallback.bind(this));
        this.speechProvider.on("stopped_speaking", this.speakingStoppedCallback.bind(this));
    }

    private speakingCallback() {
        this.controlledTokens.forEach(token => {
            // NOTE: type - animate does exist on context
            token.document.update({
                [VRTManager.TokenUpdatePropertyKey]: VRTManager.SpeakingTint
            }, <any>{ animate: false });
        })
    }

    private speakingStoppedCallback() {
        this.controlledTokens.forEach(token => {
            // NOTE: type - animate does exit on context
            token.document.update({
                [VRTManager.TokenUpdatePropertyKey]: VRTManager.NonSpeakingTint
            }, <any>{ animate: false });
        })
    }

    private associationChangedCallback() {
        if (!(game instanceof Game)) return;
        this.updateControlledTokens(game);
    }

    private readyCallback() {
        if (!(game instanceof Game)) return;
        this.registerSettings(game);
        this.updateControlledTokens(game);
        const socketHandler = new VRTSocketHandler;
        (game.modules.get(VRT_CONST.NameSpace) as VRTModuleData).socketHandler = socketHandler;
    }

    private registerSettings(game: Game) {
        game.settings.registerMenu(VRT_CONST.NameSpace, VRT_CONST.NameSpace + ".association.menu", {
            name: game.i18n.localize(VRT_TranslationKeys.Associations),
            label: game.i18n.localize(VRT_TranslationKeys.AssocSettings),
            hint: game.i18n.localize(VRT_TranslationKeys.AssocSettingsHint),
            // NOTE: type - correctly extends FormApplication 
            type: VRTAssociationSettings as any,
            restricted: true
        })
    }

    private updateControlledTokens(game: Game) {
        this.controlledTokens =
            game.actors?.filter(a => a.getFlag(VRT_CONST.NameSpace, VRT_CONST.ActorToUserAssociationKey) === game.userId)
                .flatMap(char => char.getActiveTokens()) ?? [];

        console.log("VRT | Controlled Tokens:", this.controlledTokens);
    }
}