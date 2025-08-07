import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);


const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",  
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

export const handler = async (event) => {
  try {
    let competitionId;

    
    if (event.body) {
      if (typeof event.body === "string") {
        try {
          const parsedBody = JSON.parse(event.body);
          competitionId = parsedBody.competitionId;
        } catch {
          console.error("Invalid JSON string in event.body");
        }
      } else if (typeof event.body === "object") {
        competitionId = event.body.competitionId;
      }
    }

    
    if (!competitionId) {
      competitionId = event.pathParameters?.id || event.queryStringParameters?.id;
    }

    if (!competitionId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Competition ID is required" }),
      };
    }

    const params = {
      TableName: "SportsStats",
      Key: { id: competitionId },
    };

    const data = await ddbDocClient.send(new GetCommand(params));

    if (!data.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Competition not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    console.error("Error fetching competition stats:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
