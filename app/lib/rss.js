import Parser from "rss-parser";

const parser = new Parser({ timeout: 8000 });

export const SOURCES = {
  bigGovLeft: [
    { name: "AlterNet", url: "https://www.alternet.org/feeds/" },
    { name: "The American Prospect", url: "https://prospect.org/api/rss/" },
    { name: "Common Dreams", url: "https://www.commondreams.org/rss.xml" },
    { name: "Consortium News", url: "https://consortiumnews.com/feed/" },
    { name: "Current Affairs", url: "https://www.currentaffairs.org/feed" },
    { name: "Daily Kos", url: "https://www.dailykos.com/rss/recentstories.xml" },
    { name: "In These Times", url: "https://inthesetimes.com/feed" },
    { name: "Monthly Review", url: "https://monthlyreview.org/feed/" },
    { name: "Left Voice", url: "https://www.leftvoice.org/feed/" },
    { name: "Black Agenda Report", url: "https://blackagendareport.com/feed" },
  ],
  bigGovRight: [
    { name: "Newsmax", url: "https://www.newsmax.com/rss/Newsfront/16/" },
    { name: "The Blaze", url: "https://feeds.theblaze.com/blaze-latest" },
    { name: "Washington Examiner", url: "https://www.washingtonexaminer.com/feed" },
    { name: "New York Post", url: "https://nypost.com/feed/" },
    { name: "The American Conservative", url: "https://www.theamericanconservative.com/feed/" },
    { name: "Breitbart", url: "https://feeds.feedburner.com/breitbart" },
    { name: "Townhall", url: "https://townhall.com/rss" },
    { name: "RedState", url: "https://redstate.com/feed/" },
    { name: "OANN", url: "https://www.oann.com/feed/" },
    { name: "Washington Times", url: "https://www.washingtontimes.com/rss/headlines/" },
  ],
  libLeft: [
    { name: "The Intercept", url: "https://theintercept.com/feed/?rss" },
    { name: "Democracy Now", url: "https://www.democracynow.org/democracynow.rss" },
    { name: "Mother Jones", url: "https://www.motherjones.com/feed/" },
    { name: "Truthout", url: "https://truthout.org/feed/" },
    { name: "CounterPunch", url: "https://www.counterpunch.org/feed/" },
    { name: "The Nation", url: "https://www.thenation.com/feed/?post_type=article" },
    { name: "Jacobin", url: "https://jacobin.com/feed/" },
    { name: "ACLU", url: "https://www.aclu.org/news/feed" },
    { name: "The Baffler", url: "https://thebaffler.com/feed" },
    { name: "The Progressive", url: "https://progressive.org/feed/" },
  ],
  libRight: [
    { name: "Cato Institute", url: "https://www.cato.org/rss.xml" },
    { name: "Mises Institute", url: "https://mises.org/feed" },
    { name: "Antiwar.com", url: "https://www.antiwar.com/rss/latest.xml" },
    { name: "LewRockwell.com", url: "https://www.lewrockwell.com/feed/" },
    { name: "Cafe Hayek", url: "https://cafehayek.com/feed" },
    { name: "FEE", url: "https://fee.org/articles/feed/" },
    { name: "The Independent Review", url: "https://www.independent.org/rss/" },
    { name: "EconLog", url: "https://www.econlib.org/feed/indexEconLog_xml" },
    { name: "Ron Paul Liberty Report", url: "https://www.ronpaullibertyreport.com/feed" },
    { name: "Reason", url: "https://reason.com/feed/" },
  ],
};

async function fetchFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.slice(0, 8).map((item) => ({
      title: item.title?.trim() || "",
      source: source.name,
    }));
  } catch {
    return [];
  }
}

export async function fetchAllHeadlines() {
  const results = { bigGovLeft: [], bigGovRight: [], libLeft: [], libRight: [] };

  await Promise.all(
    Object.entries(SOURCES).map(async ([quadrant, sources]) => {
      const fetched = await Promise.all(sources.map(fetchFeed));
      results[quadrant] = fetched.flat().filter((h) => h.title.length > 10);
    })
  );

  return results;
}
