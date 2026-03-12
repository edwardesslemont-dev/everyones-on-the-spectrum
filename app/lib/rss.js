import Parser from "rss-parser";

const parser = new Parser({ timeout: 4000 });

export const SOURCES = {
  authLeft: [
    { name: "Common Dreams", url: "https://www.commondreams.org/rss.xml" },
    { name: "Daily Kos", url: "https://www.dailykos.com/rss/recentstories.xml" },
    { name: "The American Prospect", url: "https://prospect.org/api/rss/" },
    { name: "In These Times", url: "https://inthesetimes.com/feed" },
    { name: "The Nation", url: "https://www.thenation.com/feed/?post_type=article" },
  ],
  authRight: [
    { name: "Breitbart", url: "https://feeds.feedburner.com/breitbart" },
    { name: "Newsmax", url: "https://www.newsmax.com/rss/Newsfront/16/" },
    { name: "Washington Examiner", url: "https://www.washingtonexaminer.com/feed" },
    { name: "New York Post", url: "https://nypost.com/feed/" },
    { name: "Washington Times", url: "https://www.washingtontimes.com/rss/headlines/" },
  ],
  libLeft: [
    { name: "The Intercept", url: "https://theintercept.com/feed/?rss" },
    { name: "Mother Jones", url: "https://www.motherjones.com/feed/" },
    { name: "Jacobin", url: "https://jacobin.com/feed/" },
    { name: "Democracy Now", url: "https://www.democracynow.org/democracynow.rss" },
    { name: "CounterPunch", url: "https://www.counterpunch.org/feed/" },
  ],
  libRight: [
    { name: "Reason", url: "https://reason.com/feed/" },
    { name: "Cato Institute", url: "https://www.cato.org/rss.xml" },
    { name: "Mises Institute", url: "https://mises.org/feed" },
    { name: "Antiwar.com", url: "https://www.antiwar.com/rss/latest.xml" },
    { name: "FEE", url: "https://fee.org/articles/feed/" },
  ],
};

async function fetchFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.slice(0, 3).map((item) => ({
      title: item.title?.trim() || "",
      source: source.name,
    }));
  } catch {
    return [];
  }
}

export async function fetchAllHeadlines() {
  const results = { authLeft: [], authRight: [], libLeft: [], libRight: [] };

  await Promise.all(
    Object.entries(SOURCES).map(async ([quadrant, sources]) => {
      const fetched = await Promise.all(sources.map(fetchFeed));
      results[quadrant] = fetched.flat().filter((h) => h.title.length > 10);
    })
  );

  return results;
}
