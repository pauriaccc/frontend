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

  const parsedDates = journalDates
    .map((dateStr) => {
      const date = new Date(dateStr);
      return Number.isNaN(date.getTime()) ? null : date;
    })
    .filter((date) => date !== null)
    .sort((a, b) => b.getTime() - a.getTime());

  if (parsedDates.length === 0) {
    return 0;
  }

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const isWeekday = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  };

  const today = normalizeDate(nowDate);

  let mostRecentWeekdayEntry = null;
  for (let i = 0; i < parsedDates.length; i++) {
    const normalizedDate = normalizeDate(parsedDates[i]);
    if (isWeekday(normalizedDate)) {
      mostRecentWeekdayEntry = normalizedDate;
      break;
    }
  }

  if (!mostRecentWeekdayEntry) {
    return 0;
  }

  const entryDates = new Set(
    parsedDates
      .map((d) => normalizeDate(d))
      .filter((d) => isWeekday(d))
      .map((d) => d.getTime())
  );

  let streak = 0;
  let currentWeekday = new Date(mostRecentWeekdayEntry);

  while (currentWeekday.getTime() <= today.getTime()) {
    if (isWeekday(currentWeekday)) {
      if (entryDates.has(currentWeekday.getTime())) {
        streak++;
      } else {
        break;
      }
    }
    currentWeekday.setDate(currentWeekday.getDate() - 1);
  }

  return streak;
}
