import { ActorUserAssociation, VRT_CONST } from "./shared";

interface AssociationChangedPayload {
    type: VRT_CONST.AssociationChanged;
    association: ActorUserAssociation;
}

type Payload = AssociationChangedPayload;

export class VRTSocketHandler {
    private static readonly id = "module." + VRT_CONST.NameSpace;

    constructor() {
        this.registerSocketHandler();
    }

    public emitAssociationChanged(association: ActorUserAssociation) {
        if (!(game instanceof Game)) return;
        const payload: Payload = { type: VRT_CONST.AssociationChanged, association };
        game.socket?.emit(VRTSocketHandler.id, payload);
        Hooks.callAll(VRT_CONST.AssociationChanged, association);
    }

    private registerSocketHandler() {
        if (!(game instanceof Game)) return;
        game.socket?.on(VRTSocketHandler.id, (packet: Payload) => {
            if (packet.type === VRT_CONST.AssociationChanged) {
                Hooks.callAll(VRT_CONST.AssociationChanged);
            }
        })
    }
}