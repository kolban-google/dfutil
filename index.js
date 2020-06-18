/**
 * intent create
 * --display-name
 * --training-phrase
 * --response-text
 * 
 * Common
 * --project [PROJECT_ID]
 * 
 */
const dialogflow = require('@google-cloud/dialogflow');
/*
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

let input = `
"key_1","key_2"
"value 1","value 2"
`;

input = fs.readFileSync('data.csv');
const records = parse(input, {
    columns: true,
    skip_empty_lines: true
});

console.log(records);
*/

var argv = require('yargs')
    .command("intent", "Intent processing", (yargs) => {
        /*
        yargs.positional("create", {
            describe: "Create an intent"
        });
        */
        yargs.command("create", "Create an intent", (yargs) => {
            yargs.option("display-name", {
                describe: "Display name for intent",
                demandOption: true,
                requiresArg: true,
                type: "string"
            })
            .option("training-phrase", {
                describe: "Training phrase",
                demandOption: true,
                requiresArg: true,
                type: "string"
            })
            .option("response-text", {
                describe: "Response text",
                demandOption: true,
                requiresArg: true,
                type: "string"
            })
        });

    })
    .option("project", {
        describe: "Project ID",
        demandOption: true,
        requiresArg: true,
        type: "string"
    })
    .demandCommand(1)
    .help()
    .argv;

//console.log(JSON.stringify(argv));

const projectId = argv.project;

//const projectId = "myagent-hhmilc"

async function createIntent(displayName, trainingPhrase, responseText) {
    const trainingPhrasesParts = [ trainingPhrase ];
    const messageTexts = [ responseText ];

    const intentsClient = new dialogflow.IntentsClient();
    const agentPath = intentsClient.agentPath(projectId);
    const trainingPhrases = [];

    trainingPhrasesParts.forEach(trainingPhrasesPart => {
        const part = {
            text: trainingPhrasesPart,
        };

        // Here we create a new training phrase for each provided part.
        const trainingPhrase = {
            type: 'EXAMPLE',
            parts: [part],
        };

        trainingPhrases.push(trainingPhrase);
    });

    const messageText = {
        text: messageTexts,
    };

    const message = {
        text: messageText,
    };

    const intent = {
        displayName: displayName,
        trainingPhrases: trainingPhrases,
        messages: [message],
    };

    const createIntentRequest = {
        parent: agentPath,
        intent: intent,
    };

    // Create the intent
    try {
        const [response] = await intentsClient.createIntent(createIntentRequest);
        console.log(`Intent ${response.name} created`);
    }
    catch(e) {
        console.log(e);
    }
}

switch(argv._[0]) {
    case "intent":
        //console.log("Processing intent");
        switch(argv._[1]) {
            case "create":
                //console.log("Processing intent create");
                createIntent(argv.displayName, argv.trainingPhrase, argv.responseText);
                break;
            default:
                console.log("Unknown command following intent");
                break;
        }
        break;
    default:
        console.log("Unknown command");
        break;
}
//run();