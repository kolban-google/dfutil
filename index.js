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
        yargs.command("csv", "Create intents from CSV", (yargs) => {
            yargs.option("csv-file", {
                describe: "CSV file",
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


async function createIntentsFromCSV(csvFile) {
    const fs = require('fs');
    const csvParse = require('csv-parse/lib/sync');
    const crypto = require('crypto');



    const fileData = fs.readFileSync(csvFile);
    const records = csvParse(fileData, {
        "columns": false,
        "skip_empty_lines": true,
        "from_line": 2 // Skip the header line

    });
    //console.log(records);
    for (let i=0; i<records.length; i++) {
        const record = records[i];
        const trainingPhrase = record[0];
        const responseText = record[1];
        const hash = crypto.createHash('sha256');
        hash.update(trainingPhrase);
        const displayName = hash.digest('hex');

        //console.log(`Display Name: ${displayName}, Training: ${trainingPhrase}, Response Text: ${responseText} `);
        await createIntent(displayName, trainingPhrase, responseText)
    };
}

switch(argv._[0]) {
    case "intent":
        //console.log("Processing intent");
        switch(argv._[1]) {
            case "create":
                //console.log("Processing intent create");
                createIntent(argv.displayName, argv.trainingPhrase, argv.responseText);
                break;
            case "csv":
                //console.log("Create intents from a CSV");
                createIntentsFromCSV(argv.csvFile);
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