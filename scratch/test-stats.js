const lcQuery = `query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    submitStats { acSubmissionNum { count difficulty } }
  }
  userContestRanking(username: $username) { rating badge { name } }
}`;

async function test() {
  const cf = await fetch('https://codeforces.com/api/user.info?handles=Misou_sou').then(r => r.json());
  console.log('CF:', cf.result?.[0]);

  const lc = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: lcQuery, variables: { username: 'miso_so' } })
  }).then(r => r.json());
  console.log('LC:', JSON.stringify(lc, null, 2));

  const ccReq = await fetch('https://www.codechef.com/users/diffused');
  const ccHtml = await ccReq.text();
  const ratingMatch = ccHtml.match(/class="rating">(\d+)</);
  const maxRatingMatch = ccHtml.match(/Highest Rating (\d+)/);
  const starsMatch = ccHtml.match(/class="rating-star">\s*<span[^>]*>(.+?)<\/span>/);
  console.log('CC:', {
    rating: ratingMatch ? ratingMatch[1] : null,
    max: maxRatingMatch ? maxRatingMatch[1] : null,
    stars: starsMatch ? starsMatch[1] : null
  });
}
test();
