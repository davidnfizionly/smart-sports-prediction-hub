// Lambda Consumer - Smart Sports Prediction Hub
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// === CONFIGURATION ===
const ddb = new DynamoDBClient({ region: "us-east-1" });
const s3 = new S3Client({ region: "us-east-1" });
const DDB_TABLE = process.env.DDB_TABLE || "SportsStats";
const S3_BUCKET = process.env.S3_BUCKET || "sports-datasets";

export const handler = async (event) => {
  console.log("Received Kinesis Event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const payload = Buffer.from(record.kinesis.data, "base64").toString("utf-8");
    const data = JSON.parse(payload);

    const item = {
      id: { S: `${Date.now()}-${Math.floor(Math.random() * 1000)}` },
      competition: { S: data.competition || "unknown" },
      entity: { S: data.entity || "unknown" },
      stats: { S: JSON.stringify(data.stats) },
      timestamp: { S: data.timestamp || new Date().toISOString() }
    };

    // ✅ 1. Stockage dans DynamoDB
    try {
      await ddb.send(new PutItemCommand({
        TableName: DDB_TABLE,
        Item: item
      }));
      console.log("DynamoDB: Record saved successfully.");
    } catch (err) {
      console.error("DynamoDB Error:", err);
    }

    // ✅ 2. Archivage dans S3
    try {
      const key = `archive/${data.competition}/${Date.now()}.json`;
      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: JSON.stringify(data),
        ContentType: "application/json"
      }));
      console.log(`S3: Archived to ${key}`);
    } catch (err) {
      console.error("S3 Error:", err);
    }
  }

  return { statusCode: 200, body: "Processing complete" };
};
