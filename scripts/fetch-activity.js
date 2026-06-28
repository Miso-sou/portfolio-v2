import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, '../public/activity-data.json');

const GITHUB_USERNAME = 'Miso-sou';
const LEETCODE_USERNAME = 'miso_so';
const CODEFORCES_USERNAME = 'Misou_sou';
const ATCODER_USERNAME = 'misosou';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function formatDate(date) {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

const dataMap = {};
function addData(dateStr, type, count) {
  if (!dataMap[dateStr]) dataMap[dateStr] = { github: 0, cp: 0 };
  dataMap[dateStr][type] += count;
}

async function fetchGitHub() {
  try {
    const res = await fetch(`https://github-contributions-api.deno.dev/${GITHUB_USERNAME}.json`);
    const data = await res.json();
    const weeks = data.contributions || [];
    for (const week of weeks) {
      for (const day of week) {
        if (day.contributionCount > 0) {
          addData(day.date, 'github', day.contributionCount);
        }
      }
    }
  } catch (e) {
    console.error('GitHub fetch error:', e);
  }
}

async function fetchLeetCode() {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query userProfileCalendar($username: String!) {
          matchedUser(username: $username) {
            userCalendar {
              submissionCalendar
            }
          }
        }`,
        variables: { username: LEETCODE_USERNAME }
      })
    });
    const data = await res.json();
    const calendarStr = data.data?.matchedUser?.userCalendar?.submissionCalendar;
    if (!calendarStr) return;
    
    const calendar = JSON.parse(calendarStr);
    for (const [timestamp, count] of Object.entries(calendar)) {
      const dateStr = formatDate(parseInt(timestamp) * 1000);
      addData(dateStr, 'cp', count);
    }
  } catch (e) {
    console.error('LeetCode fetch error:', e);
  }
}

async function fetchCodeforces() {
  try {
    const res = await fetch(`https://codeforces.com/api/user.status?handle=${CODEFORCES_USERNAME}`);
    const data = await res.json();
    if (data.status !== 'OK') return;
    
    for (const sub of data.result) {
      if (sub.verdict === 'OK') {
        const dateStr = formatDate(sub.creationTimeSeconds * 1000);
        addData(dateStr, 'cp', 1);
      }
    }
  } catch (e) {
    console.error('Codeforces fetch error:', e);
  }
}

async function fetchAtCoder() {
  try {
    const res = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${ATCODER_USERNAME}&from_second=0`);
    const data = await res.json();
    if (!Array.isArray(data)) return;
    
    for (const sub of data) {
      if (sub.result === 'AC') {
        const dateStr = formatDate(sub.epoch_second * 1000);
        addData(dateStr, 'cp', 1);
      }
    }
  } catch (e) {
    console.error('AtCoder fetch error:', e);
  }
}

async function fetchPlatformStats() {
  const stats = {
    codeforces: null,
    leetcode: null,
    codechef: null
  };

  try {
    const cf = await fetch(`https://codeforces.com/api/user.info?handles=${CODEFORCES_USERNAME}`).then(r => r.json());
    if (cf.status === 'OK' && cf.result?.[0]) {
      const user = cf.result[0];
      stats.codeforces = {
        handle: CODEFORCES_USERNAME,
        rating: user.rating,
        maxRating: user.maxRating,
        rank: user.rank?.toUpperCase()
      };
    }
  } catch (e) {
    console.error('CF stats error:', e);
  }

  try {
    const lcQuery = `query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats { acSubmissionNum { count difficulty } }
      }
      userContestRanking(username: $username) { rating badge { name } }
    }`;
    const lc = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: lcQuery, variables: { username: LEETCODE_USERNAME } })
    }).then(r => r.json());
    
    if (lc.data?.matchedUser) {
      const allSolved = lc.data.matchedUser.submitStats.acSubmissionNum.find(x => x.difficulty === 'All')?.count;
      const ranking = lc.data.userContestRanking;
      stats.leetcode = {
        handle: LEETCODE_USERNAME,
        solved: allSolved,
        rating: ranking ? Math.round(ranking.rating) : null,
        badge: ranking?.badge?.name || 'N/A'
      };
    }
  } catch (e) {
    console.error('LC stats error:', e);
  }

  try {
    const ccHtml = await fetch(`https://www.codechef.com/users/diffused`).then(r => r.text());
    
    let rating = null;
    const ratingIndex = ccHtml.indexOf('class="rating-number"');
    if (ratingIndex !== -1) {
      const match = ccHtml.substring(ratingIndex, ratingIndex + 100).match(/(\d+)/);
      if (match) rating = parseInt(match[1]);
    }
    
    const maxRatingMatch = ccHtml.match(/Highest Rating (\d+)/);
    
    // Count star symbols. The HTML uses &#9733; entities for stars.
    // We decode and count the ★ characters, or count the entity occurrences.
    let starCount = null;
    const starsSection = ccHtml.match(/class="rating-star"[^>]*>([\s\S]*?)<\/span>/);
    if (starsSection) {
      const starEntities = starsSection[1].match(/&#9733;/g) || [];
      const starChars = starsSection[1].match(/★/g) || [];
      starCount = starEntities.length + starChars.length;
      if (starCount === 0) starCount = 1; // default to 1 star if we found the section
    }
    
    stats.codechef = {
      handle: 'diffused',
      rating: rating,
      maxRating: maxRatingMatch ? parseInt(maxRatingMatch[1]) : null,
      stars: starCount ? starCount + '★' : null
    };
  } catch (e) {
    console.error('CC stats error:', e);
  }

  const statsPath = path.join(__dirname, '../public/platform-stats.json');
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  console.log(`Platform stats saved to ${statsPath}`);
}

async function main() {
  console.log('Fetching activity data...');
  await Promise.allSettled([
    fetchGitHub(),
    fetchLeetCode(),
    fetchCodeforces(),
    fetchAtCoder(),
    fetchPlatformStats()
  ]);
  
  fs.writeFileSync(outputPath, JSON.stringify(dataMap, null, 2));
  console.log(`Activity data saved to ${outputPath}`);
}

main();
