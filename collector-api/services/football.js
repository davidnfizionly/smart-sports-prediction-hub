import fetch from 'node-fetch';

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_HOST = process.env.FOOTBALL_API_HOST;

export async function fetchFootballMatches() {
    const url = "https://api-football-v1.p.rapidapi.com/v3/leagues";

    const headers = {
        "X-RapidAPI-Key": FOOTBALL_API_KEY,
        "X-RapidAPI-Host": FOOTBALL_API_HOST
    };

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Football API error: ${res.statusText}`);
    const data = await res.json();

    // ✅ Adapter en fonction de la structure de l'API
    return data.response.map(l => ({
        competition: l.league.name,
        team: l.country.name,
        stats: { season: l.seasons?.[0]?.year || "N/A" },
        timestamp: new Date().toISOString()
    }));
}
