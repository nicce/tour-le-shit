export async function GetScoreboard() {

    const response = await fetch('/scoreboard');
    return await response.json();
}
