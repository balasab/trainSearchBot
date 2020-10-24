// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var request = require("request");

const { ActivityHandler, MessageFactory } = require('botbuilder');
async function getOutput(utterance) {

    var options = {
        method: 'POST',
        url: 'http://localhost:9876/model/parse',
        qs: { token: 'thisismysecret' },
        headers:
        {
            'postman-token': '0b632b30-b62f-6175-4a79-bfbb4a50d0c1',
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: { text: 'Hello, I am Rasa!' },
        json: true
    };

    let res = await new Promise((resolve) => {
        request(options, async function (error, response, body) {

            console.log(body);
            resolve(body)
        })
    });
    return res
}
class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            let output = await getOutput(context.activity.text)
            console.log(output, "---------")
            const replyText = `Echo: ${context.activity.text}`;
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
