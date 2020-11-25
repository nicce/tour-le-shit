
export async function GetScoreboard() {

    const response = await fetch('/scoreboard');
    return await response.json();
}

export async function SubmitScorecard(body: string) {
    fetch('/scorecard', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: body
    });
}
