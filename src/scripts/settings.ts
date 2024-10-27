import { ActorUserAssociation, VRT_CONST, VRT_TranslationKeys, VRTModuleData } from "./shared";

type SettingsViewData = {
    associations:
    {
        actorName: string; actorId: string;
        selectedUserId: string;
        users: { userName: string; userId: string; }[];
    }[]
};

export class VRTAssociationSettings extends FormApplication<FormApplicationOptions, SettingsViewData, ActorUserAssociation> {
    static override get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: (<Game>game).i18n.localize(VRT_TranslationKeys.AssocSettings),
            id: VRT_CONST.NameSpace + ".association.form",
            template: `modules/${VRT_CONST.NameSpace}/templates/settings.html`,
            width: 550,
            height: "auto",
            closeOnSubmit: true
        }) as FormApplicationOptions;
    }

    protected override async _updateObject(_: Event, association?: ActorUserAssociation) {
        if (!association) return;
        console.log(association);
        if (!(game instanceof Game)) return;
        await Promise.all(Object.entries(association).map(async ([actorId, userId]) => {
            await game.actors?.get(actorId)?.setFlag(VRT_CONST.NameSpace, VRT_CONST.ActorToUserAssociationKey, userId);
        }));
        (game.modules.get(VRT_CONST.NameSpace) as VRTModuleData)?.socketHandler?.emitAssociationChanged(association);
    }

    override getData() {
        if (!(game instanceof Game) || !game.users || !game.actors) return { associations: [] };
        const users = game.users;
        const actors = game.actors;

        const associations: SettingsViewData["associations"] = actors.map(a => {
            // NOTE: type - ownership does exist on Actor here
            const actor = a as Actor & { ownership: Record<string, number> };

            const userIds = Object.entries(actor.ownership)
                // NOTE: type - CONST contains document ownership levels
                .filter(([_, ownership]) => ownership === (CONST as any).DOCUMENT_OWNERSHIP_LEVELS.OWNER)
                .map(([key]) => key);
            const selectedUserId = actor.getFlag(VRT_CONST.NameSpace, VRT_CONST.ActorToUserAssociationKey) as string ?? "";
            const actorUsers = users
                .filter(u => userIds.includes(u.id))
                .map(a => ({ userName: a.name!, userId: a.id! }));

            return { actorName: actor.name!, actorId: actor.id!, selectedUserId, users: actorUsers };
        })

        return { associations };
    }
}