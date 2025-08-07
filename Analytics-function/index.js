const AWS = require("aws-sdk");
const { OpenAI } = require("openai");

const docClient = new AWS.DynamoDB.DocumentClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // stocké dans les variables d'environnement Lambda
});

exports.handler = async (event) => {
  console.log("📥 Event received:", event);

  let input;
  if (event.body) {
    try {
      input = JSON.parse(event.body);
    } catch (err) {
      console.error("❌ Invalid JSON in body:", err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON format in request body" })
      };
    }
  } else {
    input = event;
  }

  const { competitionId, competition, season, award } = input;

  if (!competitionId || !competition || !season || !award) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields: competitionId, competition, season, or award" })
    };
  }

  // ✅ Utilisation correcte de la clé primaire 'id'
  const params = {
    TableName: "SportsStats",
    Key: {
      id: competitionId
    }
  };

  try {
    const data = await docClient.get(params).promise();
    const stats = data.Item;

    if (!stats) {
      throw new Error("No stats found for this competition.");
    }

    const prompt = `
You are a professional sports analyst.

Based on the following season data for ${competition} ${season}, make a realistic prediction.

🟢 Available stats:
${JSON.stringify(stats, null, 2)}

🏅 Award to predict: ${award}

Please provide:
- A winner or top player depending on the award
- A confidence score out of 100
- 2-3 key performance trends
- Optional: top 4 teams (semi-finalists), top 8 (quarter-finalists), etc.

Format the response as a JSON object like this:
{
  "winner": "Team or Player Name",
  "confidence_score": 87,
  "predicted_top_scorer": "Player Name",
  "key_performance_trends": [
    "Example trend 1",
    "Example trend 2"
  ],
  "semi_finalists": ["Team A", "Team B", "Team C", "Team D"],
  "quarter_finalists": ["Team E", "Team F", "Team G", "Team H"]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const prediction = completion.choices[0].message.content;

    console.log("✅ Prediction generated:", prediction);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ prediction })
    };

  } catch (error) {
    console.error("❌ Lambda execution error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
