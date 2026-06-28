import { useState, useEffect, useMemo, useRef } from 'react';
import codechefLogo from '../assets/platforms/codechef.svg';
import leetcodeLogo from '../assets/platforms/LeetCode_logo_black.png';
import codeforcesLogo from '../assets/platforms/codeforces.webp';

const LEVELS = [
  'bg-[#E0F4F4] border border-os-ink/30',
  'bg-[#80D4D4] border border-os-ink/30',
  'bg-[#20A0A8] border border-os-ink/30',
  'bg-[#0A5860] border border-os-ink/30',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateStr(date) {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

function getLevel(total) {
  if (total === 0) return 0;
  if (total <= 2) return 1;
  if (total <= 5) return 2;
  return 3;
}

function PlatformCard({ title, logo, handle, badge, stats, link }) {
  return (
    <a href={link} target="_blank" rel="noreferrer" className="flex-1 min-w-[300px] border-2 border-os-ink bg-os-window p-3 hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_var(--color-os-ink)] transition-all flex flex-col gap-3 group cursor-pointer">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <img src={logo} alt={title} className="h-5 object-contain" />
          <span className="font-display text-sm tracking-widest font-bold text-os-ink">{title}</span>
        </div>
        {badge && badge !== 'N/A' && (
          <span className="text-[9px] font-display uppercase px-2 py-1 bg-os-ink text-os-bg shrink-0">
            {badge}
          </span>
        )}
      </div>
      <div className="font-body text-lg font-bold text-[#20A0A8]">@{handle}</div>
      <div className="flex justify-between mt-auto pt-2 border-t border-os-ink/20">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col">
            <span className="font-display text-[9px] uppercase tracking-widest opacity-70">{s.label}</span>
            <span className="font-body font-bold mt-1 text-os-ink">{s.value || 'N/A'}</span>
          </div>
        ))}
      </div>
    </a>
  );
}

export default function ActivityMapApp() {
  const [data, setData] = useState({});
  const [platformStats, setPlatformStats] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [loading, setLoading] = useState(true);
  const tooltipRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch('/activity-data.json').then(res => res.json()),
      fetch('/platform-stats.json').then(res => res.json()).catch(() => null)
    ])
      .then(([activityJson, statsJson]) => {
        setData(activityJson);
        setPlatformStats(statsJson);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load activity data', err);
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    let totalCommits = 0;
    let problemsSolved = 0;
    
    // Convert to sorted array of dates
    const allDates = Object.keys(data).sort();
    
    allDates.forEach(date => {
      totalCommits += data[date].github || 0;
      problemsSolved += data[date].cp || 0;
    });

    // Calculate streaks
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    const todayStr = formatDateStr(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = formatDateStr(yesterdayDate);

    if (allDates.length > 0) {
      const firstDate = new Date(allDates[0]);
      const end = new Date();
      for (let d = new Date(firstDate); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDateStr(d);
        const dayTotal = (data[dateStr]?.github || 0) + (data[dateStr]?.cp || 0);
        
        if (dayTotal > 0) {
          tempStreak++;
          if (tempStreak > maxStreak) maxStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
      }
      
      let checkDate = new Date();
      let foundMiss = false;
      
      const todayTotal = (data[todayStr]?.github || 0) + (data[todayStr]?.cp || 0);
      if (todayTotal === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      while (!foundMiss) {
        const dStr = formatDateStr(checkDate);
        const t = (data[dStr]?.github || 0) + (data[dStr]?.cp || 0);
        if (t > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          foundMiss = true;
        }
      }
    }

    return { totalCommits, problemsSolved, currentStreak, maxStreak };
  }, [data]);

  const gridData = useMemo(() => {
    const today = new Date();
    const endDay = today.getDay(); 
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7) - endDay);

    const weeks = [];
    let currentWeek = [];
    
    const monthsPos = [];
    let lastMonth = -1;

    for (let i = 0; i <= 52 * 7 + endDay; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = formatDateStr(d);
      const dayData = data[dateStr] || { github: 0, cp: 0 };
      const total = dayData.github + dayData.cp;
      
      if (d.getDay() === 0 && d.getDate() <= 7 && d.getMonth() !== lastMonth) {
        monthsPos.push({ name: MONTHS[d.getMonth()], index: weeks.length });
        lastMonth = d.getMonth();
      }

      currentWeek.push({
        date: d,
        dateStr,
        github: dayData.github,
        cp: dayData.cp,
        total,
        level: getLevel(total),
        isFuture: d > today
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      while(currentWeek.length < 7) {
        currentWeek.push({ isFuture: true });
      }
      weeks.push(currentWeek);
    }
    
    return { weeks, monthsPos };
  }, [data]);

  return (
    <div className="flex flex-col h-full bg-os-bg relative overflow-y-auto retro-scrollbar" onMouseLeave={() => setHoveredCell(null)}>
      {/* Title Bar */}
      <div className="px-4 py-3 border-b-2 border-os-ink bg-os-window shrink-0">
        <h1 className="font-display text-lg tracking-widest text-os-ink uppercase shadow-[2px_2px_0px_var(--color-os-ink)] inline-block px-2 bg-os-accent border-2 border-os-ink">
          Activity Calendar
        </h1>
      </div>

      {/* Content with left+right borders */}
      <div className="flex flex-col flex-1 border-l-2 border-r-2 border-os-ink">

      {/* Stats Bar */}
      <div className="flex flex-wrap border-b-2 border-os-ink bg-os-window shrink-0">
        <div className="flex-1 min-w-[120px] p-3 border-r-2 border-os-ink text-center flex flex-col items-center justify-center">
          <span className="font-display text-[9px] uppercase tracking-widest text-os-ink opacity-70 mb-1">Total Commits</span>
          <span className="font-body text-xl font-bold text-os-ink">{stats.totalCommits}</span>
        </div>
        <div className="flex-1 min-w-[120px] p-3 border-r-2 border-os-ink text-center flex flex-col items-center justify-center">
          <span className="font-display text-[9px] uppercase tracking-widest text-os-ink opacity-70 mb-1">Problems Solved</span>
          <span className="font-body text-xl font-bold text-os-ink">{stats.problemsSolved}</span>
        </div>
        <div className="flex-1 min-w-[120px] p-3 border-r-2 border-os-ink text-center flex flex-col items-center justify-center">
          <span className="font-display text-[9px] uppercase tracking-widest text-os-ink opacity-70 mb-1">Current Streak</span>
          <span className="font-body text-xl font-bold text-[#E0F4F4]" style={{ textShadow: '1px 1px 0px var(--color-os-ink)' }}>
            {stats.currentStreak} <span className="text-sm">days</span>
          </span>
        </div>
        <div className="flex-1 min-w-[120px] p-3 text-center flex flex-col items-center justify-center">
          <span className="font-display text-[9px] uppercase tracking-widest text-os-ink opacity-70 mb-1">Max Streak</span>
          <span className="font-body text-xl font-bold text-[#0A5860]" style={{ textShadow: '1px 1px 0px var(--color-os-ink)' }}>
            {stats.maxStreak} <span className="text-sm">days</span>
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="p-4 shrink-0 overflow-x-auto retro-scrollbar flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <span className="font-body text-sm text-os-ink opacity-80">Live Activity Map (Last 12 Months)</span>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-[7px] opacity-70">Less</span>
            {LEVELS.map((cls, i) => (
              <div key={i} className={`w-3 h-3 ${cls}`} />
            ))}
            <span className="font-display text-[7px] opacity-70">More</span>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="font-display text-xs animate-pulse">Loading data...</span>
          </div>
        ) : (
          <div className="relative w-max mt-2">
            {/* Months Header */}
            <div className="flex absolute top-[-18px] left-[24px]">
              {gridData.monthsPos.map((m, i) => (
                <span 
                  key={i} 
                  className="font-display text-[8px] absolute opacity-70"
                  style={{ left: m.index * 15 }} // 12px width + 3px gap = 15px
                >
                  {m.name}
                </span>
              ))}
            </div>
            
            <div className="flex gap-[3px]">
              {/* Day Labels */}
              <div className="flex flex-col gap-[3px] mt-[2px] mr-2">
                {WEEK_DAYS.map((d, i) => (
                  <span key={i} className="font-display text-[7px] h-3 leading-3 opacity-60">
                    {i % 2 !== 0 ? d : ''}
                  </span>
                ))}
              </div>

              {/* Grid */}
              {gridData.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      onMouseEnter={(e) => !day.isFuture && setHoveredCell({ ...day, rect: e.target.getBoundingClientRect() })}
                      className={`w-3 h-3 ${day.isFuture ? 'bg-transparent' : LEVELS[day.level]} cursor-pointer transition-colors duration-75`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-y-2 border-os-ink bg-os-window shrink-0">
        <span className="font-body text-xs text-os-ink opacity-60">
          Grid intensity colors represent combined daily activity volume (GitHub commits + CP/DSA platform submissions).
        </span>
      </div>

      {/* CP/DSA Stats Section */}
      {platformStats && (
        <div className="p-4 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm tracking-widest uppercase text-os-ink border-b-2 border-os-ink/30 pb-1">CP/DSA STATS</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {platformStats.codeforces && (
              <PlatformCard 
                title="Codeforces" 
                logo={codeforcesLogo} 
                handle={platformStats.codeforces.handle} 
                badge={platformStats.codeforces.rank} 
                link={`https://codeforces.com/profile/${platformStats.codeforces.handle}`}
                stats={[
                  { label: 'Rating', value: platformStats.codeforces.rating },
                  { label: 'Max Rating', value: platformStats.codeforces.maxRating }
                ]} 
              />
            )}
            {platformStats.codechef && (
              <PlatformCard 
                title="CodeChef" 
                logo={codechefLogo} 
                handle={platformStats.codechef.handle} 
                badge={platformStats.codechef.stars} 
                link={`https://www.codechef.com/users/${platformStats.codechef.handle}`}
                stats={[
                  { label: 'Rating', value: platformStats.codechef.rating },
                  { label: 'Max Rating', value: platformStats.codechef.maxRating }
                ]} 
              />
            )}
            {platformStats.leetcode && (
              <PlatformCard 
                title="LeetCode" 
                logo={leetcodeLogo} 
                handle={platformStats.leetcode.handle} 
                badge={platformStats.leetcode.badge} 
                link={`https://leetcode.com/u/${platformStats.leetcode.handle}`}
                stats={[
                  { label: 'Solved', value: platformStats.leetcode.solved },
                  { label: 'Rating', value: platformStats.leetcode.rating }
                ]} 
              />
            )}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredCell && (
        <div 
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 bg-os-ink text-os-bg p-3 border-2 border-os-accent shadow-[4px_4px_0px_var(--color-os-accent)] transition-opacity duration-150"
          style={{
            top: hoveredCell.rect.top - 110,
            left: hoveredCell.rect.left - 70,
          }}
        >
          <div className="font-display text-[10px] mb-2 border-b border-os-bg/30 pb-1 uppercase tracking-wider text-os-accent">
            {hoveredCell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex flex-col gap-1.5 font-body text-sm">
            <div className="flex justify-between gap-4">
              <span className="opacity-80">GitHub:</span>
              <span className="font-bold">{hoveredCell.github} commits</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="opacity-80">CP Activity:</span>
              <span className="font-bold">{hoveredCell.cp} submissions</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
