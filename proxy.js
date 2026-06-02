#!/usr/bin/env node
'use strict';
const http=require('http');
const https=require('https');
const {URL}=require('url');
const PORT=process.env.PORT||3000;
const XC_HOST='http://barqtv.live';
const XC_USER='A4076193855';
const XC_PASS='5244735714';
const ORIGIN=process.env.ALLOWED_ORIGIN||'*';
const CH={
1:{name:'beIN Sports 1',q:{'4K':{xui:'393670',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8FJZOcLkl0der47QYxvyEMjEmHZi6gjxJIz-5T7wbSU5/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pfjwl27hM6Pctp5EfVWwOnX/ts'},'FHD':{xui:'393701',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgAQgH1iI-B8Et2LBBtHdPh87/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgAQk2vaEb_5AHWCV16ZeTbCs/ts'},'HD':{xui:'393729',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgARE-dQmZyLn4FsiNJdygyWp/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pcZGefxarfDDhB2xr6A1FJL/ts'},'SD':{xui:'393756',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgATwh7PNLI7BhzqByS9zEslt/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pcV0tSfzOM7iRRh43qZS_BY/ts'}}},
2:{name:'beIN Sports 2',q:{'4K':{xui:'393672',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8FJZOcLkl0der47QYxvyEMgHiTT7gZRrCENPok5oimbJ/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pcmyI_F9n8EhtxBq7cCktUC/ts'},'FHD':{xui:'393703',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgATsDAeA6eA5XyBX0CMLbKat/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgARLrZbkQMfDIxCdHSDsonfm/ts'},'HD':{xui:'393731',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgAREXgFv9FRrKtS0glc5nm2t/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7peBYJr1-TYjBABPs55Ehjl-/ts'},'SD':{xui:'393758',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgAToH2JYfSBOzrjHW1mjXuaK/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7peCK7U4w3NMAHvvU1uDwMai/ts'}}},
3:{name:'beIN Sports 3',q:{'4K':{xui:'393674',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8FJZOcLkl0der47QYxvyEMjf2wRwNay8mRZ31GUleP5F/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pcLJ2b6jwERnUpR9V6B17Lm/ts'},'FHD':{xui:'393705',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgASLx_TR2mIzrRx-dyoloOBi/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgARU3OiEQfhu78N9kCEhY1Ht/ts'},'HD':{xui:'393733',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgASEL4FeD7KDUJglMiq-DwDp/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pe4OQt-Cwi2y2YRULvQrNhZ/ts'},'SD':{xui:'393760',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgASsAWtsJ7coBdR9Oh0mfnyZ/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pczhw_Q-ZRyUUj7wqgjBjfL/ts'}}},
4:{name:'beIN Sports 4',q:{'4K':{xui:'393676',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8FJZOcLkl0der47QYxvyEMjD6CMoP343rI5T4yYaN4LM/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7peL_QIUg2T0VsGXjBlEYZQ_/ts'},'FHD':{xui:'393707',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgATCm0FhKv5I2n64kA4Li--b/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgASUYamwrMYs3Hs5b6gdAYT6/ts'},'HD':{xui:'393735',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgATbOQzv2k__pBo94LcXyKlR/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pclcu8ZGXrRO_aG0T43uqAJ/ts'},'SD':{xui:'393762',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgAQnv_QLvor4Mb5hz3R0Tcfu/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pe7wr7YyUM9R-p2NHHiKWrq/ts'}}},
5:{name:'beIN Sports 5',q:{'4K':{xui:'393678',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8FJZOcLkl0der47QYxvyEMiUz9zOMBokMoKf8Jn0h7LS/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pfIqSAq7xuOQ5hRFHnQrCCV/ts'},'FHD':{xui:'393709',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgASBa_9s84dvOS6zdfFR2H7p/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgAR-dcb53lT0frpMHVSjrazk/ts'},'HD':{xui:'393737',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgASXbBV4Ut5anOUu3GKgwuxc/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7peZz-VinPTnK2hdmhERLWhh/ts'},'SD':{xui:'393764',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgARXKXx6F1U1c_072izwR2N9/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pc5KXZIayL1o1LKbyD77PgM/ts'}}},
6:{name:'beIN Sports 6',q:{'4K':{xui:'393680',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8FJZOcLkl0der47QYxvyEMjZIK6t5N1T9DRr38tlxn7C/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7pfwXEf50KWc43fjtH5-Jqve/ts'},'FHD':{xui:'393711',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgARbN21fZyXEUfkVCPxKQEk0/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgATa6J6w62rNhT_8wS_nbjS1/ts'},'HD':{xui:'393739',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgAT6Yj7b6nZrIR062S5rfL_1/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7petzpnX5IaTZJW5B-tGREos/ts'},'SD':{xui:'393766',p:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8J2dOgNva7sXGe0lzeZUgATVOSrj9a3Ug_FSXi65EpFU/ts',b:'http://barq-tv.site:80/play/EGwSGNTitwhW38-0vrcO8DpOOM8VOXwspwZJSlwt7peiP-GFY6kogL-I5HrrNMO0/ts'}}}
};
const ST={};
function st(c,q){const k=`${c}_${q}`;if(!ST[k])ST[k]={pri:true,fails:0,t:0};return ST[k];}
function getUrl(c,q){const d=CH[c]?.q?.[q];if(!d)return null;const s=st(c,q);if(!s.pri&&Date.now()-s.t>300000){s.pri=true;s.fails=0;}return s.pri?d.p:d.b;}
function fail(c,q){const s=st(c,q);s.fails++;s.t=Date.now();if(s.pri&&s.fails>=2){s.pri=false;}}
function fetch_(url,h={}){return new Promise((res,rej)=>{const u=new URL(url),lib=u.protocol==='https:'?https:http;const r=lib.request({hostname:u.hostname,port:u.port||(u.protocol==='https:'?443:80),path:u.pathname+u.search,method:'GET',timeout:15000,headers:{'User-Agent':'WC2026/2.0','Accept':'*/*',...h}},res);r.on('error',rej);r.on('timeout',()=>{r.destroy();rej(new Error('timeout'));});r.end();});}
async function readAll(s){const c=[];for await(const x of s)c.push(Buffer.from(x));return Buffer.concat(c).toString();}
function rewrite(m,src,pub){const base=src.substring(0,src.lastIndexOf('/')+1);return m.split('\n').map(l=>{const t=l.trim();if(!t||t.startsWith('#'))return l;const a=t.startsWith('http')?t:base+t;if(/\.ts(\?|$)/.test(a)||/\/play\/[A-Za-z0-9_\-]+\/ts$/.test(a))return`${pub}/seg?u=${encodeURIComponent(a)}`;if(a.includes('.m3u8'))return`${pub}/m3u?u=${encodeURIComponent(a)}`;return l;}).join('\n');}
function cors(r){r.setHeader('Access-Control-Allow-Origin',ORIGIN);r.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');r.setHeader('Access-Control-Allow-Headers','Range,Origin');r.setHeader('Access-Control-Expose-Headers','Content-Length,Content-Range');}
function json(r,c,o){r.writeHead(c,{'Content-Type':'application/json'});r.end(JSON.stringify(o));}
function pub(req){return`${req.headers['x-forwarded-proto']||'http'}://${req.headers['x-forwarded-host']||req.headers['host']||`localhost:${PORT}`}`;}
async function pipe(res,c,q,rng){
  const tryUrl=async(url,retry=false)=>{
    try{const up=await fetch_(url,rng?{Range:rng}:{});if(up.statusCode>=400)throw new Error(up.statusCode);
      const h={'Content-Type':up.headers['content-type']||'video/mp2t','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
      if(up.headers['content-length'])h['Content-Length']=up.headers['content-length'];
      if(up.headers['content-range'])h['Content-Range']=up.headers['content-range'];
      res.writeHead(up.statusCode===206?206:200,h);up.pipe(res);up.on('error',()=>{if(!res.writableEnded)res.end();});
    }catch(e){
      if(!retry){fail(c,q);const fb=getUrl(c,q);if(fb!==url)return tryUrl(fb,true);
        const xt=`${XC_HOST}/live/${XC_USER}/${XC_PASS}/${CH[c]?.q?.[q]?.xui}.ts`;
        if(xt!==url&&xt!==fb)return tryUrl(xt,true);}
      if(!res.headersSent)json(res,502,{error:e.message});
    }};
  const url=getUrl(c,q);if(!url)return json(res,404,{error:'not found'});await tryUrl(url);
}
http.createServer(async(req,res)=>{
  cors(res);if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  const u=new URL(req.url,'http://x'),path=u.pathname,pb=pub(req);
  if(path==='/health')return json(res,200,{ok:true,channels:6});
  if(path==='/channels')return json(res,200,{channels:Object.entries(CH).map(([n,c])=>({num:+n,name:c.name,q:Object.keys(c.q).map(q=>({q,stream:`${pb}/stream/${n}/${q}`,hls:`${pb}/hls/${n}/${q}`}))}))});
  const hM=path.match(/^\/hls\/(\d+)\/(\w+)$/);
  if(hM){const[,c,q]=hM;const xui=CH[+c]?.q?.[q]?.xui;if(!xui)return json(res,404,{error:'not found'});
    try{const up=await fetch_(`${XC_HOST}/live/${XC_USER}/${XC_PASS}/${xui}.m3u8`);if(up.statusCode===200){const raw=await readAll(up);if(raw.includes('#EXTM3U')||raw.includes('#EXT-X')){res.writeHead(200,{'Content-Type':'application/vnd.apple.mpegurl','Cache-Control':'no-cache'});return res.end(rewrite(raw,`${XC_HOST}/live/${XC_USER}/${XC_PASS}/${xui}.m3u8`,pb));}}}catch{}
    res.writeHead(200,{'Content-Type':'application/vnd.apple.mpegurl','Cache-Control':'no-cache'});return res.end(`#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:10\n#EXT-X-MEDIA-SEQUENCE:0\n#EXTINF:10,\n${pb}/stream/${c}/${q}\n`);
  }
  const tM=path.match(/^\/stream\/(\d+)\/(\w+)$/);
  if(tM){const[,c,q]=tM;return pipe(res,+c,q,req.headers['range']);}
  if(path==='/seg'){const url=decodeURIComponent(u.searchParams.get('u')||'');if(!url)return json(res,400,{error:'missing u'});
    try{const up=await fetch_(url,req.headers['range']?{Range:req.headers['range']}:{});const h={'Content-Type':up.headers['content-type']||'video/mp2t','Cache-Control':'public,max-age=30'};if(up.headers['content-length'])h['Content-Length']=up.headers['content-length'];if(up.headers['content-range'])h['Content-Range']=up.headers['content-range'];res.writeHead(up.statusCode===206?206:200,h);up.pipe(res);up.on('error',()=>{if(!res.writableEnded)res.end();});}catch{if(!res.headersSent){res.writeHead(502);res.end();}}return;}
  if(path==='/m3u'){const url=decodeURIComponent(u.searchParams.get('u')||'');if(!url)return json(res,400,{error:'missing u'});try{const up=await fetch_(url);const raw=await readAll(up);res.writeHead(200,{'Content-Type':'application/vnd.apple.mpegurl','Cache-Control':'no-cache'});res.end(rewrite(raw,url,pb));}catch{if(!res.headersSent){res.writeHead(502);res.end();}}return;}
  json(res,404,{routes:['/health','/channels','/stream/:ch/:q','/hls/:ch/:q']});
}).listen(PORT,'0.0.0.0',()=>{console.log(`WC2026 Proxy running on port ${PORT}`);});
