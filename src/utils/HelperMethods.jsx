export function getPlacementProgressAndLevel(startISO, endISO, nowDate = new Date()) {
  if (!startISO || !endISO) {
    return { progress: 0, level: 1, status: "missing_dates" };
  }

  const start = new Date(startISO);
  const end = new Date(endISO);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return { progress: 0, level: 1, status: "invalid_dates" };
  }

  if (nowDate < start) {
    return { progress: 0, level: 1, status: "not_started" };
  }

  if (nowDate >= end) {
    return { progress: 1, level: 10, status: "complete" };
  }

  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = nowDate.getTime() - start.getTime();
  const rawProgress = elapsedMs / totalMs;

  const progress = Math.max(0, Math.min(1, rawProgress));
  const level = 1 + Math.floor(progress * 9);

  return { progress, level, status: "in_progress" };
}

export function getPlacementWeekTitle(startISO, endISO, nowDate = new Date()) {
  if (!startISO || !endISO) return "Placement";

  const start = new Date(startISO);
  const end = new Date(endISO);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return "Placement";
  }

  if (nowDate < start) return "Placement Not Started";
  if (nowDate >= end) return "Placement Complete";

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceStart = Math.floor((nowDate.getTime() - start.getTime()) / msPerDay);

  const weekNumber = 1 + Math.floor(daysSinceStart / 7);

  return `Placement Week ${weekNumber}`;
}

export function calculateJournalStreak(journalDates = [], nowDate = new Date()) {
  if (!Array.isArray(journalDates) || journalDates.length === 0) {
    return 0;
  }

  const normalize = (d) => {
    const date = new Date(d);
    date.setHours(0,0,0,0);
    return date;
  };

  const isWeekday = (d) => {
    const day = d.getDay();
    return day >= 1 && day <= 5;
  };

  const parsed = journalDates
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));

  const entrySet = new Set(parsed.map((d) => normalize(d).getTime()));

  let day = normalize(nowDate);

  if (day.getDay() === 6) day.setDate(day.getDate() - 1);
  if (day.getDay() === 0) day.setDate(day.getDate() - 2);

  if (!entrySet.has(day.getTime())) {
    day.setDate(day.getDate() - 1);
  }

  let streak = 0;

  while (true) {

    if (!isWeekday(day)) {
      day.setDate(day.getDate() - 1);
      continue;
    }

    if (!entrySet.has(day.getTime())) {
      break;
    }

    streak++;

    day.setDate(day.getDate() - 1);
  }

  return streak;
}
