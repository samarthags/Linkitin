// lib/duo.js
// Duo level is now purely time-based (days bonded), not activity-based.
// Triangular growth, matching the exact examples given:
//   Level 1 -> 1 day bonded
//   Level 2 -> 3 days bonded   (1+2)
//   Level 3 -> 6 days bonded   (1+2+3)
//   Level 4 -> 10 days bonded  (1+2+3+4)
// i.e. level n requires n*(n+1)/2 total days. Capped at level 100.
// (Level 100 works out to 5,050 days (~14 years) with this exact growth
// rate — that's inherent to a linearly-increasing-gap curve. If you want
// max level reachable sooner, tell me a target and I'll adjust the formula.)

export function bondDays(startDate) {
  if (!startDate) return 0;
  const days = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000);
  return Math.max(1, days + 1); // the day you bond already counts as day 1
}

export function daysForLevel(level) {
  return (level * (level + 1)) / 2;
}

export function levelFromDays(days) {
  let level = 1;
  for (let n = 1; n <= 100; n++) {
    if (days >= daysForLevel(n)) level = n;
    else break;
  }
  return level;
}

export function daysToNextLevel(days) {
  const current = levelFromDays(days);
  if (current >= 100) return null;
  return Math.max(0, daysForLevel(current + 1) - days);
}

// Streak: ticks up only when BOTH partners had tracked activity on the
// same day. Called from track.js whenever either partner gets a view/
// click/share. Combined stats (views/clicks/shares) are still tracked and
// shown in the Duo modal — they just no longer drive the level.
export async function bumpDuoStreak(db, duoId, activeUsername) {
  const duo = await db.collection("duos").findOne({ _id: duoId });
  if (!duo || duo.status !== "active") return;

  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const activeToday = { ...(duo.activeToday || {}), [activeUsername]: today };
  const bothActiveToday = activeToday[duo.userA] === today && activeToday[duo.userB] === today;

  let { current = 0, longest = 0, lastBothActiveDate = null } = duo.streak || {};
  if (bothActiveToday && lastBothActiveDate !== today) {
    current = lastBothActiveDate === yesterday ? current + 1 : 1;
    longest = Math.max(longest, current);
    lastBothActiveDate = today;
  }

  await db.collection("duos").updateOne(
    { _id: duoId },
    { $set: { activeToday, streak: { current, longest, lastBothActiveDate } } }
  );
}
