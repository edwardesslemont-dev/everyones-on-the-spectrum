import Parser from "rss-parser";

const parser = new Parser({ timeout: 4000 });

export const SOURCES = {
  authLeft: [
    { name: "New York Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml" },
    { name: "NBC News", url: "https://feeds.nbcnews.com/nbcnews/public/news" },
    { name: "NPR", url: "https://feeds.npr.org/1001/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/us/rss" },
    { name: "The Atlantic", url: "https://www.theatlantic.com/feed/all/" },
  ],
  authRight: [
    { name: "Fox News", url: "https://feeds.foxnews.com/foxnews/politics" },
    { name: "New York Post", url: "https://nypost.com/feed/" },
    { name: "Washington Examiner", url: "https://www.washingtonexaminer.com/feed" },
    { name: "National Review", url: "https://www.nationalreview.com/feed/" },
    { name: "Daily Wire", url: "https://www.dailywire.com/rss.xml" },
  ],
  libLeft: [
    { name: "The Intercept", url: "https://theintercept.com/feed/?rss" },
    { name: "Mother Jones", url: "https://www.motherjones.com/feed/" },
    { name: "Jacobin", url: "https://jacobin.com/feed/" },
    { name: "Democracy Now!", url: "https://www.democracynow.org/democracynow.rss" },
    { name: "Common Dreams", url: "https://www.commondreams.org/rss.xml" },
  ],
  libRight: [
    { name: "Reason", url: "https://reason.com/feed/" },
    { name: "Cato Institute", url: "https://www.cato.org/rss.xml" },
    { name: "Mises Institute", url: "https://mises.org/feed" },
    { name: "Antiwar.com", url: "https://www.antiwar.com/rss/latest.xml" },
    { name: "FEE", url: "https://fee.org/articles/feed/" },
  ],
  general: [
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
    { name: "Wired", url: "https://www.wired.com/feed/rss" },
    { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index" },
    { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
    { name: "Variety", url: "https://variety.com/feed/" },
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
  const results = { authLeft: [], authRight: [], libLeft: [], libRight: [], general: [] };

  await Promise.all(
    Object.entries(SOURCES).map(async ([quadrant, sources]) => {
      const fetched = await Promise.all(sources.map(fetchFeed));
      results[quadrant] = fetched.flat().filter((h) => h.title.length > 10);
    })
  );

  return results;
}
