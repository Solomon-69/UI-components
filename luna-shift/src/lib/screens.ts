// Every real Luna Shift capture, 1206x2622, light mode.
export type ScreenId =
  | 'today-home-hero'
  | 'today-timeline-and-factors'
  | 'hormone-therapy-overview'
  | 'patterns-calendar-hot-flash'
  | 'patterns-trend-time-of-day'
  | 'patterns-night-sweat-trend'
  | 'patterns-sleep-and-heart'
  | 'insights-weekly-summary'
  | 'insights-whats-shifting'
  | 'log-a-dose'
  | 'symptom-check-in'
  | 'settings-and-connections'
  | 'paced-breathing'

export const screenAlt: Record<ScreenId, string> = {
  'today-home-hero': 'Luna Shift Today screen: a greeting, a 7 out of 10 wellbeing score marked easing, and one-tap buttons for hot flash, night sweat, mood, sleep and brain fog',
  'today-timeline-and-factors': "Today's timeline showing a hot flash, an estrogen patch dose and sleep, plus caffeine, breathing exercise and exercise factors with a gentle note on what today may mean",
  'hormone-therapy-overview': 'Hormone Therapy screen with the next estrogen patch dose in 9 hours, a Log a dose button, supplement scanning and 89% adherence over four weeks',
  'patterns-calendar-hot-flash': 'Patterns screen with a September calendar shaded by symptom load, plum dots for logged doses, and a 30-day hot flash trend',
  'patterns-trend-time-of-day': 'A 30-day hot flash trend and a time-of-day chart showing hot flashes most often logged between 13:00 and 16:00',
  'patterns-night-sweat-trend': 'Patterns calendar and a 30-day night sweat trend in purple',
  'patterns-sleep-and-heart': 'A 30-day sleep trend next to Apple Health context: resting heart rate 58 bpm, HRV 48 ms, 7.7k steps a day and 115 minutes of workouts',
  'insights-weekly-summary': 'Insights screen: this week hot flashes down 53%, 8 this week versus 17 last week, with a shareable card and a symptom check-in scoring 8 of 44',
  'insights-whats-shifting': 'Symptom check-in results by category and a What is shifting list: night sweats down 33%, sleep steady',
  'log-a-dose': 'Log a dose sheet with hormone, method, amount, status, time and an optional note',
  'symptom-check-in': 'Paced breathing exercise, cycle 9 of 9, with 15 sessions and 43 calm minutes logged',
  'settings-and-connections': 'Settings sheet with a daily check-in reminder, dose reminders, camera, and Apple Health toggles for sleep, menstrual flow, heart rate and weight',
  'paced-breathing': 'Paced breathing exercise: breathe out, cycle 4 of 9, 14 sessions and 41 calm minutes',
}

export const screenSrc = (id: ScreenId, w: 520 | 900) => `${import.meta.env.BASE_URL}screens/${id}-${w}.webp`
