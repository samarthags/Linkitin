// lib/duo.js
// Shared Duo logic used by the API routes. Levels are driven by the SAME
// analytics fields track.js already writes (views/linkClicks/shares) —
// nothing invented, no separate "score" system required.

// Weighted "combined activity" — clicks count more than views, shares most
// of all, since they take more effort from a visitor.
export function combinedActivityTotal(stats = {}) {
  return (stats.views || 0) + (stats.clicks || 0) * 2 + (stats.shares || 0) * 5;
}

// 10 levels — tune these thresholds to taste once you see real traffic.
export const DUO_LEVEL_THRESHOLDS = [0, 20, 60, 150, 300, 600, 1200, 2500, 5000, 10000];

export function computeDuoLevel(stats) {
  const total = combinedActivityTotal(stats);
  let lvl = 1;
  DUO_LEVEL_THRESHOLDS.forEach((t, i) => { if (total >= t) lvl = i + 1; });
  return Math.min(lvl, 10);
}

export function bondDays(startDate) {
  if (!startDate) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000));
}

// Called after track.js increments stats for a duo member. Recomputes
// level and bumps the streak if BOTH partners have now had activity today.
export async function onDuoActivity(db, duoId, activeUsername) {
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

  const level = computeDuoLevel(duo.combinedStats || {});

  await db.collection("duos").updateOne(
    { _id: duoId },
    { $set: { activeToday, streak: { current, longest, lastBothActiveDate }, level } }
  );
}
