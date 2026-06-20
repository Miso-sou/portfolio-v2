// Generate placeholder activity data (52 weeks x 7 days)
function generateActivityData() {
  const data = [];
  for (let week = 0; week < 52; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      // Random activity level 0-4
      days.push(Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 4) + 1);
    }
    data.push(days);
  }
  return data;
}

const LEVELS = [
  'bg-os-window border border-os-ink/30',
  'bg-os-accent/40 border border-os-ink/30',
  'bg-os-accent/60 border border-os-ink/30',
  'bg-os-accent/80 border border-os-ink/30',
  'bg-os-accent border border-os-ink/30',
];

const activityData = generateActivityData();

export default function ActivityMapApp() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-sm">Activity Map</h1>
      <p className="text-sm">Contributions in the last year (placeholder data)</p>
      <div className="overflow-x-auto retro-scrollbar">
        <div className="flex gap-[3px] w-max">
          {activityData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((level, di) => (
                <div
                  key={di}
                  className={`w-3 h-3 ${LEVELS[level]}`}
                  title={`Week ${wi + 1}, Day ${di + 1}: Level ${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-display text-[7px]">Less</span>
        {LEVELS.map((cls, i) => (
          <div key={i} className={`w-3 h-3 ${cls}`} />
        ))}
        <span className="font-display text-[7px]">More</span>
      </div>
    </div>
  );
}
