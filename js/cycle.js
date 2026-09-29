// Cycle math. getCycleInfoFor() finds which cycle contains a given date,
// so overdue users still get correct predictions.

function cycleInfoFor(date) {
  if (!state.data.lastDate) return null;

  const last = parseDate(state.data.lastDate);
  const cycleLen = state.data.cycleLength;
  const periodLen = state.data.periodLength;
  const luteal = state.data.lutealPhase;

  const target = midnight(date);
  const idx = Math.floor(diffDays(last, target) / cycleLen);

  const start = addDays(last, idx * cycleLen);
  const periodEnd = addDays(start, periodLen - 1);
  const nextStart = addDays(start, cycleLen);
  const ovulation = addDays(nextStart, -luteal);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);

  return { start, periodEnd, nextStart, ovulation, fertileStart, fertileEnd };
}

function phaseFor(date) {
  const info = cycleInfoFor(date);
  if (!info) return null;

  const d = midnight(date);
  if (d >= info.start && d <= info.periodEnd) return 'menstrual';
  if (isSameDay(d, info.ovulation)) return 'ovulation';
  if (d >= info.fertileStart && d <= info.fertileEnd) return 'fertile';
  if (d < info.ovulation) return 'follicular';
  return 'luteal';
}

function phaseLabel(p) {
  const T = t();
  return {
    menstrual: T.phaseMenstrual,
    follicular: T.phaseFollicular,
    fertile: T.phaseFertile,
    ovulation: T.phaseOvulation,
    luteal: T.phaseLuteal
  }[p] || '';
}

function upcomingPeriods(fromDate, count) {
  const info = cycleInfoFor(fromDate);
  if (!info) return [];
  const out = [];
  for (let i = 1; i <= count; i++) {
    out.push(addDays(info.start, state.data.cycleLength * i));
  }
  return out;
}