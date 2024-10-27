import { ModuleData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs";
import { VRTSocketHandler } from "./socket_handler";

export enum VRT_CONST {
    NameSpace = 'vrt',
    ActorToUserAssociationKey = 'userAssociation',
    AssociationChanged = 'associationChanged',
}

export enum VRT_TranslationKeys {
    Title = "vrt.title",
    Associations = "vrt.associations",
    AssocSettings = "vrt.associationsSettings",
    AssocSettingsHint = "vrt.associationsSettingsHint",
    OptionsNone = "vrt.options.None"
}

export type ActorUserAssociation = Record<string, string>;

export type VRTModuleData = Game.ModuleData<ModuleData> & { socketHandler?: VRTSocketHandler }; 