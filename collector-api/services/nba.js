import fetch from 'node-fetch';

const NBA_API_KEY = process.env.NBA_API_KEY;
const NBA_API_HOST = process.env.NBA_API_HOST;

export async function fetchNBAGames() {
    const url = "https://api-nba-v1.p.rapidapi.com/games";
    const headers = {
        "X-RapidAPI-Key": NBA_API_KEY,
        "X-RapidAPI-Host": NBA_API_HOST
    };

    try {
        console.log("📡 Fetching NBA games from external API...");
        const res = await fetch(url, { headers });

        if (!res.ok) {
            throw new Error(`NBA API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        if (!data.response || data.response.length === 0) {
            console.warn("⚠️ NBA API returned no games. Using fallback mock data.");
            return [
                {
                    competition: "NBA",
                    team: "Mock Lakers",
                    stats: { score: 110 },
                    timestamp: new Date().toISOString()
                }
            ];
        }

        console.log(`✅ Retrieved ${data.response.length} NBA games`);
        return data.response.map(g => ({
            competition: "NBA",
            team: g.teams?.home?.name || "Unknown Team",
            stats: { score: g.scores?.home?.points ?? 0 },
            timestamp: new Date().toISOString()
        }));
    } catch (err) {
        console.error("❌ Failed to fetch NBA data:", err.message);
        console.log("➡️ Returning fallback NBA data");

        // Fallback mock si API échoue complètement
        return [
            {
                competition: "NBA",
                team: "Fallback Celtics",
                stats: { score: 105 },
                timestamp: new Date().toISOString()
            }
        ];
    }
}
