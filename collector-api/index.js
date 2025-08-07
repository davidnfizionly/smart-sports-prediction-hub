import { fetchFootballMatches } from './services/football.js';
import { fetchNBAGames } from './services/nba.js';
import AWS from 'aws-sdk';

const kinesis = new AWS.Kinesis({ region: "us-east-1" });
const STREAM_NAME = process.env.KINESIS_STREAM || "sportsstatsstream";

// ✅ Fonction de récupération sécurisée
async function safeFetch(fetchFn, label) {
    try {
        const data = await fetchFn();
        if (data && data.length > 0) {
            console.log(`✅ ${label} data fetched successfully`);
            return data;
        }
    } catch (err) {
        console.error(`❌ ${label} API error:`, err.message);
    }
    return [{
        competition: label,
        team: "DemoTeam",
        stats: { score: Math.floor(Math.random() * 5) },
        timestamp: new Date().toISOString()
    }];
}

// ✅ Envoi vers AWS Kinesis
async function sendToKinesis(data) {
    for (const item of data) {
        const params = {
            Data: JSON.stringify(item),
            PartitionKey: item.competition,
            StreamName: STREAM_NAME
        };
        await kinesis.putRecord(params).promise();
        console.log(`📤 Sent to Kinesis: ${item.competition}`);
    }
}

// ✅ Exécution principale
(async () => {
    const football = await safeFetch(fetchFootballMatches, "Football");
    const nba = await safeFetch(fetchNBAGames, "NBA");
    const allEvents = [...football, ...nba];

    if (allEvents.length > 0) {
        await sendToKinesis(allEvents);
    } else {
        console.log("⚠️ No events to send to Kinesis");
    }
})();
