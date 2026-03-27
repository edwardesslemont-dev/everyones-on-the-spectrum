"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},5315:e=>{e.exports=require("path")},8621:e=>{e.exports=require("punycode")},6162:e=>{e.exports=require("stream")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},2623:e=>{e.exports=require("worker_threads")},1568:e=>{e.exports=require("zlib")},7561:e=>{e.exports=require("node:fs")},4492:e=>{e.exports=require("node:stream")},2477:e=>{e.exports=require("node:stream/web")},6007:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>x,patchFetch:()=>f,requestAsyncStorage:()=>h,routeModule:()=>d,serverHooks:()=>y,staticGenerationAsyncStorage:()=>m});var a={};r.r(a),r.d(a,{POST:()=>c,dynamic:()=>p,maxDuration:()=>l});var s=r(9303),o=r(8716),n=r(670),i=r(4588);let p="force-dynamic",l=60,u=new i.ZP({apiKey:process.env.ANTHROPIC_API_KEY});async function c(e){let{messages:t,story:r}=await e.json(),a=r?`You are a sharp, non-partisan political analyst helping a reader go deeper on a news story. You explain perspectives with genuine empathy — you never strawman any side.

The story the user is reading:
Headline: ${r.headline}
Category: ${r.category}
Facts:
${r.facts.map((e,t)=>`${t+1}. ${e}`).join("\n")}

Political perspectives on this story:
${Object.entries(r.quadrants).map(([,e])=>`${e.label} (sentiment: ${e.sentiment}/5):
  Why they feel this way: ${e.why}
  How they'd argue it: ${e.defense}`).join("\n\n")}

Guidelines:
- Keep responses concise — 2–4 paragraphs max unless the user asks for more.
- Don't repeat information already shown on the page unless asked to elaborate.
- You can speculate about implications, historical context, and likely outcomes — clearly labeled as analysis, not fact.
- Stay anchored to this specific story. If the user goes off-topic, gently redirect.
- Never advocate for a political position. Illuminate all sides honestly.`:"You are a helpful political analyst. Answer questions about news and politics with balance and clarity.",s=new TextEncoder;return new Response(new ReadableStream({async start(e){try{for await(let r of u.messages.stream({model:"claude-haiku-4-5-20251001",max_tokens:1e3,system:a,messages:t.filter(e=>"string"==typeof e.content&&e.content.trim()).map(e=>({role:e.role,content:e.content}))}))"content_block_delta"===r.type&&"text_delta"===r.delta.type&&e.enqueue(s.encode(r.delta.text))}catch(t){e.enqueue(s.encode(`Error: ${t.message}`))}finally{e.close()}}}),{headers:{"Content-Type":"text/plain; charset=utf-8"}})}let d=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/Users/edwardesslemont/Desktop/Claude/News/app/app/api/chat/route.js",nextConfigOutput:"",userland:a}),{requestAsyncStorage:h,staticGenerationAsyncStorage:m,serverHooks:y}=d,x="/api/chat/route";function f(){return(0,n.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:m})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948,933],()=>r(6007));module.exports=a})();