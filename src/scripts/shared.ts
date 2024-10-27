import { ModuleData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs";
import { VRTSocketHandler } from "./socket_handler";

export enum VRT_CONST {
    NameSpace = 'vrt',
    ActorToUserAssociationKey = 'userAssociation',
    AssociationChanged = 'associationChanged',
}

export enum VRT_TranslationKeys {
    Title = VRT_CONST.NameSpace + ".title",
    Associations = VRT_CONST.NameSpace + ".associations",
    AssocSettings = VRT_CONST.NameSpace + ".associationsSettings",
    AssocSettingsHint = VRT_CONST.NameSpace + ".associationsSettingsHint",
    OptionsNone = VRT_CONST.NameSpace + ".options.None"
}

export type ActorUserAssociation = Record<string, string>;

export type VRTModuleData = Game.ModuleData<ModuleData> & { socketHandler?: VRTSocketHandler }; 