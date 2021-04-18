export async function GetScoreboard() {
    const response = await fetch('/scoreboard');
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

export async function GetPlayerScores(name: string) {
    const response = await fetch('/score?name=' + name);
    return await response.json();
}

export async function DeletePlayerScore(id: number) {
    await fetch('/score/' + id, { method: 'DELETE' });
}
