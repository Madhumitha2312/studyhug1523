export const motivationalQuotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Study hard, for the well is deep, and our brains are shallow.", author: "Richard Baxter" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
];

export function getDailyQuote() {
  const dayIndex = new Date().getDate() % motivationalQuotes.length;
  return motivationalQuotes[dayIndex];
}
