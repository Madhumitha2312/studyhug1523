export const studyPets = [
  { id: 'cat', name: 'Whiskers', emoji: '🐱', stages: ['🐱', '😺', '😸', '😻'] },
  { id: 'dog', name: 'Buddy', emoji: '🐶', stages: ['🐶', '🐕', '🦮', '🐕‍🦺'] },
  { id: 'rabbit', name: 'Hop', emoji: '🐰', stages: ['🐰', '🐇', '🐇', '🐇'] },
  { id: 'panda', name: 'Bamboo', emoji: '🐼', stages: ['🐼', '🐼', '🐼', '🐼'] },
  { id: 'owl', name: 'Sage', emoji: '🦉', stages: ['🦉', '🦉', '🦉', '🦉'] },
  { id: 'fox', name: 'Rusty', emoji: '🦊', stages: ['🦊', '🦊', '🦊', '🦊'] },
];

export function getPetStage(totalMinutes: number) {
  if (totalMinutes < 60) return 0;
  if (totalMinutes < 300) return 1;
  if (totalMinutes < 1000) return 2;
  return 3;
}

export function getPetMood(studiedToday: boolean, streakDays: number) {
  if (!studiedToday) return 'sleepy 💤';
  if (streakDays >= 7) return 'ecstatic 🌟';
  if (streakDays >= 3) return 'happy 😊';
  return 'content 🙂';
}
