export async function GetScoreboard(season: number) {
    const response = await fetch(`/scoreboard?season=${season}`);
    return await response.json();
}

export async function SubmitScorecard(body: string) {
    await fetch('/scoreboard', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: body,
    });
}

export async function GetPlayerScores(name: string, season: number) {
    const response = await fetch(`/score?name=${name}&season=${season}`);
    return await response.json();
}

export async function DeletePlayerScore(id: number) {
    await fetch('/score/' + id, { method: 'DELETE' });
}
