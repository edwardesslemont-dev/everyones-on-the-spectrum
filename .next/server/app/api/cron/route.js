"use strict";(()=>{var e={};e.id=557,e.ids=[557],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},5315:e=>{e.exports=require("path")},8621:e=>{e.exports=require("punycode")},6162:e=>{e.exports=require("stream")},5346:e=>{e.exports=require("timers")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},2623:e=>{e.exports=require("worker_threads")},1568:e=>{e.exports=require("zlib")},8678:e=>{e.exports=import("pg")},7561:e=>{e.exports=require("node:fs")},4492:e=>{e.exports=require("node:stream")},2477:e=>{e.exports=require("node:stream/web")},2218:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{originalPathname:()=>d,patchFetch:()=>l,requestAsyncStorage:()=>h,routeModule:()=>u,serverHooks:()=>p,staticGenerationAsyncStorage:()=>m});var s=r(9303),o=r(8716),n=r(670),i=r(1190),c=e([i]);i=(c.then?(await c)():c)[0];let u=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/cron/route",pathname:"/api/cron",filename:"route",bundlePath:"app/api/cron/route"},resolvedPagePath:"/Users/edwardesslemont/Desktop/Claude/News/app/app/api/cron/route.js",nextConfigOutput:"",userland:i}),{requestAsyncStorage:h,staticGenerationAsyncStorage:m,serverHooks:p}=u,d="/api/cron/route";function l(){return(0,n.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:m})}a()}catch(e){a(e)}})},1190:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{GET:()=>c});var s=r(8492),o=r(4943),n=r(4191),i=e([n]);async function c(e){let t=e.headers.get("authorization"),{searchParams:r}=new URL(e.url),a=r.get("secret");if(process.env.CRON_SECRET&&t!==`Bearer ${process.env.CRON_SECRET}`&&a!==process.env.CRON_SECRET)return Response.json({error:"Unauthorized"},{status:401});try{console.log("Cron job started:",new Date().toISOString()),await (0,n.Dv)(),console.log("Fetching RSS headlines...");let e=await (0,s.S)(),t=Object.values(e).flat().length;if(console.log(`Fetched ${t} headlines across 4 quadrants`),t<10)return Response.json({error:"Too few headlines fetched"},{status:500});console.log("Generating stories with Claude...");let r=await (0,o.O)(e);console.log(`Generated ${r.length} stories`);let a=(0,n.s6)();return await (0,n.GZ)(a,r),console.log(`Saved batch: ${a}`),await (0,n.eP)(),Response.json({success:!0,batchKey:a,count:r.length})}catch(e){return console.error("Cron job failed:",e),Response.json({error:e.message},{status:500})}}n=(i.then?(await i)():i)[0],a()}catch(e){a(e)}})},4943:(e,t,r)=>{r.d(t,{O:()=>n});let a=new(r(4588)).ZP({apiKey:process.env.ANTHROPIC_API_KEY}),s={authLeft:{label:"Progressive Governance",color:"#7965B2",bgColor:"#F7F5FD",borderColor:"#D8D0F0"},authRight:{label:"Conservative Governance",color:"#C47B3C",bgColor:"#FCF6EE",borderColor:"#EDD8B8"},libLeft:{label:"Egalitarian Anti-Establishment",color:"#4A82B0",bgColor:"#EFF6FC",borderColor:"#C0DDF0"},libRight:{label:"Free-Market Libertarian",color:"#4E8E80",bgColor:"#EFF8F6",borderColor:"#B8DDD8"}},o={authLeft:"PROGRESSIVE GOVERNANCE SOURCES",authRight:"CONSERVATIVE GOVERNANCE SOURCES",libLeft:"EGALITARIAN ANTI-ESTABLISHMENT SOURCES",libRight:"FREE-MARKET LIBERTARIAN SOURCES",general:"TECH / BUSINESS / CULTURE SOURCES"};async function n(e){let t;let r=Object.entries(e).map(([e,t])=>{let r=o[e]||e.toUpperCase(),a=t.map(e=>`  - [${e.source}] ${e.title}`).join("\n");return`${r}:
${a||"  (no items)"}`}).join("\n\n"),n=`You are the editorial engine for "Everyone's on the Spectrum" — a news app that presents the most important stories of the moment from 4 political perspectives: Progressive Governance, Conservative Governance, Egalitarian Anti-Establishment, and Free-Market Libertarian.

Here are headlines from 25 news sources across the political spectrum and general interest categories:

${r}

Your task: think like a front-page editor. Ask yourself: "What are the 5 most important things a smart, curious American should know about right now?" Then generate full coverage for each.

STORY SELECTION:
- Pick the biggest ongoing stories, not just the latest tactical update. If the Iran conflict is the top story, frame it as "Iran war escalates" — not "missile hits school." The school strike is a fact within the bigger story.
- Exception: if a single event IS the story (a presidential assassination, a landmark Supreme Court ruling, a massive acquisition), frame it at the event level.
- Actively seek variety: politics, geopolitics, economy, tech/AI, business, culture. Do not pick 5 political stories if major tech or economic stories are unfolding.
- Tech and AI stories are a priority. Business deals, major product launches, AI developments, and industry shifts are all fair game.
- The same major story can appear in consecutive refreshes if it's still the most important thing happening — just reflect the latest developments in the facts.
- Prefer stories that matter to a broad American audience over niche or hyper-partisan events.

HEADLINE FRAMING:
- Frame at the story level: "Iran War Escalates as Oil Hits $100" not "U.S. Missile Strikes Iranian School"
- Neutral and factual — no spin, no loaded language
- Specific enough to be informative, broad enough to capture the full story

For each story generate:
- A neutral, story-level headline
- A category from: Politics, Economy, Technology, Health, World, Culture
- 4–6 verified facts (specific events, numbers, names — this is where tactical details like the school strike belong)
- For each of the 4 quadrants:
  - sentiment: an integer 1–5 reflecting how this story lands for this quadrant relative to their core values. 1 = very negative/threatening to their values, 2 = negative, 3 = neutral or mixed, 4 = positive, 5 = very positive/strongly aligns with their values. This is NOT about whether the news is objectively good or bad — it's about whether it aligns with or threatens THIS quadrant's worldview.
  - why: WHY people in this quadrant feel the way they do, rooted in their core values
  - defense: HOW they'd argue their position — specific evidence, historical examples, or logic they'd use
  - sources: 2–3 real outlet names from that quadrant's typical media diet

IMPORTANT: Every story gets all 4 quadrant perspectives — even tech, business, and culture stories. AI taking jobs, corporate consolidation, government regulation of tech — the quadrant framework applies to everything.

TONE: Write with genuine empathy for each quadrant. A reader from that quadrant should recognize themselves. Don't strawman. Make the strongest honest version of each argument. Keep why and defense to 2–3 sentences max — punchy, not exhaustive.

Return ONLY a valid JSON object — no markdown, no explanation, nothing else. All string values must be on a single line (no literal newlines inside strings). Exactly this structure:

{
  "stories": [
    {
      "id": 1,
      "category": "Politics",
      "headline": "...",
      "facts": ["fact 1", "fact 2", "fact 3", "fact 4", "fact 5"],
      "quadrants": {
        "authLeft":  { "sentiment": 3, "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "authRight": { "sentiment": 3, "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "libLeft":   { "sentiment": 3, "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] },
        "libRight":  { "sentiment": 3, "why": "...", "defense": "...", "sources": ["Source A", "Source B", "Source C"] }
      }
    }
  ]
}`,i=(await a.messages.create({model:"claude-haiku-4-5-20251001",max_tokens:6e3,messages:[{role:"user",content:n}]})).content[0].text.trim(),c=(i=i.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/i,"").trim()).match(/\{[\s\S]*\}/);if(!c)throw Error("No JSON object found in Claude response");i=c[0];try{t=JSON.parse(i)}catch{t=JSON.parse(i.replace(/[\x00-\x1F\x7F]/g,e=>"\n"===e||"\r"===e||"	"===e?e:""))}return t.stories.map((e,t)=>({...e,id:t+1,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),quadrants:Object.fromEntries(Object.entries(e.quadrants).map(([e,t])=>[e,{...s[e],...t}]))}))}},4191:(e,t,r)=>{r.a(e,async(e,a)=>{try{let p;r.d(t,{Dv:()=>i,GZ:()=>c,QS:()=>u,eP:()=>h,fY:()=>l,s6:()=>m});var s=r(8678),o=e([s]);function n(){return p||(p=new s.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}})),p}async function i(){let e=n();await e.query(`
    CREATE TABLE IF NOT EXISTS story_batches (
      id SERIAL PRIMARY KEY,
      batch_key VARCHAR(50) UNIQUE NOT NULL,
      stories JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)}async function c(e,t){let r=n();await r.query(`INSERT INTO story_batches (batch_key, stories)
     VALUES ($1, $2)
     ON CONFLICT (batch_key) DO UPDATE SET stories = $2, created_at = NOW()`,[e,JSON.stringify(t)])}async function l(){let e=n(),t=await e.query("SELECT stories, created_at FROM story_batches ORDER BY created_at DESC LIMIT 1");return t.rows[0]?{stories:t.rows[0].stories,createdAt:t.rows[0].created_at}:null}async function u(){let e=n();return(await e.query(`SELECT batch_key, stories, created_at
     FROM story_batches
     WHERE created_at > NOW() - INTERVAL '14 days'
     ORDER BY created_at DESC
     OFFSET 1`)).rows}async function h(){let e=n();await e.query("DELETE FROM story_batches WHERE created_at < NOW() - INTERVAL '14 days'")}function m(){let e=new Date,t=e.toISOString().split("T")[0],r=e.getUTCHours();return`${t}-${r<12?"morning":"evening"}`}s=(o.then?(await o)():o)[0],a()}catch(e){a(e)}})},8492:(e,t,r)=>{r.d(t,{S:()=>i});var a=r(5367);let s=new(r.n(a)())({timeout:4e3}),o={authLeft:[{name:"New York Times",url:"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"},{name:"NBC News",url:"https://feeds.nbcnews.com/nbcnews/public/news"},{name:"NPR",url:"https://feeds.npr.org/1001/rss.xml"},{name:"The Guardian",url:"https://www.theguardian.com/us/rss"},{name:"The Atlantic",url:"https://www.theatlantic.com/feed/all/"}],authRight:[{name:"Fox News",url:"https://feeds.foxnews.com/foxnews/politics"},{name:"New York Post",url:"https://nypost.com/feed/"},{name:"Washington Examiner",url:"https://www.washingtonexaminer.com/feed"},{name:"National Review",url:"https://www.nationalreview.com/feed/"},{name:"Daily Wire",url:"https://www.dailywire.com/rss.xml"}],libLeft:[{name:"The Intercept",url:"https://theintercept.com/feed/?rss"},{name:"Mother Jones",url:"https://www.motherjones.com/feed/"},{name:"Jacobin",url:"https://jacobin.com/feed/"},{name:"Democracy Now!",url:"https://www.democracynow.org/democracynow.rss"},{name:"Common Dreams",url:"https://www.commondreams.org/rss.xml"}],libRight:[{name:"Reason",url:"https://reason.com/feed/"},{name:"Cato Institute",url:"https://www.cato.org/rss.xml"},{name:"Mises Institute",url:"https://mises.org/feed"},{name:"Antiwar.com",url:"https://www.antiwar.com/rss/latest.xml"},{name:"FEE",url:"https://fee.org/articles/feed/"}],general:[{name:"The Verge",url:"https://www.theverge.com/rss/index.xml"},{name:"Wired",url:"https://www.wired.com/feed/rss"},{name:"Ars Technica",url:"https://feeds.arstechnica.com/arstechnica/index"},{name:"TechCrunch",url:"https://techcrunch.com/feed/"},{name:"Variety",url:"https://variety.com/feed/"}]};async function n(e){try{return(await s.parseURL(e.url)).items.slice(0,3).map(t=>({title:t.title?.trim()||"",source:e.name}))}catch{return[]}}async function i(){let e={authLeft:[],authRight:[],libLeft:[],libRight:[],general:[]};return await Promise.all(Object.entries(o).map(async([t,r])=>{let a=await Promise.all(r.map(n));e[t]=a.flat().filter(e=>e.title.length>10)})),e}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948,933,367],()=>r(2218));module.exports=a})();