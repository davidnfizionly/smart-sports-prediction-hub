document.getElementById('loadButton').addEventListener('click', async () => {
  const competition = document.getElementById('competition').value;
  const season = document.getElementById('season').value;

  // Correction ici 👇
  const awardLabel = document.getElementById('award').value;
  const awardMap = {
    "Top Scorer (Golden Boot / Pichichi)": "Top Scorer",
    "Best Goalkeeper": "Best Goalkeeper",
    "Best Defender": "Best Defender",
    "MVP": "MVP",
    "Winner": "Winner"
  };
  const award = awardMap[awardLabel];

  const competitionMap = {
    "Premier League": "epl",
    "La Liga": "laliga",
    "Ligue 1": "ligue1",
    "UEFA Champions League": "ucl",
    "NBA": "nba"
  };

  const shortComp = competitionMap[competition];
  const competitionId = `${shortComp}-${season}`;

  const inputData = {
    competitionId,
    competition,
    season,
    award
  };

  document.getElementById('results').innerText = "⏳ Loading prediction...";

  try {
    const response = await fetch('https://2fa9cfnx98.execute-api.us-east-1.amazonaws.com/prod/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputData)
    });

    if (!response.ok) {
      throw new Error(`❌ HTTP ${response.status}`);
    }

    const responseData = await response.json();

    let parsed = responseData;
    if (typeof parsed.body === 'string') {
      parsed = JSON.parse(parsed.body);
    }

    document.getElementById('results').innerText = parsed.prediction
      ? parsed.prediction
      : JSON.stringify(parsed, null, 2);
  } catch (error) {
    console.error('Error fetching prediction:', error);
    document.getElementById('results').innerText = "❌ Error loading prediction.";
  }
});
