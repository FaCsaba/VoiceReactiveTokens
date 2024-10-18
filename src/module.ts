import hark from "hark";

let controlledTokens: Token[] = [];

// function registerSettings(game: Game) {
//     game.settings.registerMenu('reactive-tokens', 'reactive-tokens-settings', {
//         name: 'Reactive Tokens',
//         type: 
//     })
// }

Hooks.once("ready", () => {
    if (!(game instanceof Game)) return;

    // controlledTokens = game.user?.character?.getActiveTokens(true, false) ?? [];

    controlledTokens = game.actors?.filter(a => a.isOwner).flatMap(char => char.getActiveTokens(true, false)) ?? [];

    // game.scenes?.viewed?.tokens.forEach((token) => {
    //     token.getActor()?.getActiveTokens()
    // })


    console.log("Character token:", controlledTokens);
});

Hooks.once('getSceneControlButtons', (sceneControls) => {
    console.log(sceneControls);
    debugger;
    // sceneControls.push({
    //     name: '', // i18n
    //     visible: true,
    //     tools: [
    //         { icon: '',  }
    //     ]
    // })
});

(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    var speechEvents = hark(stream);

    speechEvents.on('speaking', function () {
        console.log('speaking');
        for (const token of controlledTokens) {
            token.document.update({ alpha: 1 }, <any>{ animate: false });

        }
    });

    speechEvents.on('stopped_speaking', function () {
        console.log('stopped_speaking');
        for (const token of controlledTokens) {
            token.document.update({ alpha: 0.5 }, <any>{ animate: false });
        }
    });
})();
