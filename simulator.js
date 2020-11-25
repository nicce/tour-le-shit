// amount of series
let series = [];
for(let i = 0; i<4; i++) {
  let scoreboards = [];
  // Amount of rounds per serie
  for(let k = 0; k<10; k++) {
    const point = Math.random() * (42-27) + 27;
    const nettoTweets = Math.random() * (5-0) + 0;
    const nettoEagle = Math.random() * (3-0) + 0;
    const muligans = Math.random() * (4-0) + 0;
    const scorePoint = point < 30 ? 30 : point;
    const score = Math.round(scorePoint - 36 + (nettoTweets * 2) + (nettoEagle * 2) - (muligans*2));
    scoreboards.push(score);
  }
  const sumBoard = scoreboards.reduce((a,b) => a+b)
  series.push(sumBoard);
}

console.log(series);