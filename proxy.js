'use strict';
const http=require('http');
const https=require('https');
const {URL}=require('url');
const PORT=process.env.PORT||3000;
const XC_HOST='http://barqtv.live';
const XC_USER='A4076193855';
const XC_PASS='5244735714';
const ORIGIN=process.env.ALLOWED_ORIGIN||'*';

// القنوات مع stream_id من Xtream API
const CH={
  1:{name:'beIN Sports 1',q:{'4K':'393670','FHD':'393701','HD':'393729','SD':'393756'}},
  2:{name:'beIN Sports 2',q:{'4K':'393672','FHD':'393703','HD':'393731','SD':'393758'}},
  3:{name:'beIN Sports 3',q:{'4K':'393674','FHD':'393705','HD':'393733','SD':'393760'}},
  4:{name:'beIN Sports 4',q:{'4K':'393676','FHD':'393707','HD':'393735','SD':'393762'}},
  5:{name:'beIN Sports 5',q:{'4K':'393678','FHD':'393709','HD':'393737','SD':'393764'}},
  6:{name:'beIN Sports 6',q:{'4K':'393680','FHD':'393711','HD':'393739','SD':'393766'}},
};

function getStreamUrl(id){return `${XC_HOST}/live/${XC_USER}/${XC_PASS}/${id}.ts`;}
function getM3U8Url(id){return `${XC_HOST}/live/${XC_USER}/${XC_PASS}/${id}.m3u8`;}

function fetch_(url,h={}){
  return new Promise((res,rej)=>{
    const u=new URL(url),lib=u.protocol==='https:'?https:http;
    const r=lib.request({hostname:u.hostname,port:u.port||(u.protocol==='https:'?443:80),
      path:u.pathname+u.search,method:'GET',timeout:20000,
      headers:{'User-Agent':'Mozilla/5.0','Accept':'*/*',...h}},res);
    r.on('error',rej);r.on('timeout',()=>{r.destroy();rej(new Error('timeout'));});r.end();
  });
}
async function readAll(s){const c=[];for await(const x of s)c.push(Buffer.from(x));return Buffer.concat(c).toString();}

function rewrite(m,src,pub){
  const base=src.substring(0,src.lastIndexOf('/')+1);
  return m.split('\n').map(l=>{
    const t=l.trim();if(!t||t.startsWith('#'))return l;
    const a=t.startsWith('http')?t:base+t;
    if(/\.ts(\?|$)/.test(a)||/\/live\//.test(a))return`${pub}/seg?u=${encodeURIComponent(a)}`;
    if(a.includes('.m3u8'))return`${pub}/m3u?u=${encodeURIComponent(a)}`;
    return l;
  }).join('\n');
}

function cors(r){
  r.setHeader('Access-Control-Allow-Origin',ORIGIN);
  r.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  r.setHeader('Access-Control-Allow-Headers','Range,Origin,X-Requested-With');
  r.setHeader('Access-Control-Expose-Headers','Content-Length,Content-Range');
}
function json(r,c,o){r.writeHead(c,{'Content-Type':'application/json'});r.end(JSON.stringify(o));}
function pub(req){return`${req.headers['x-forwarded-proto']||'http'}://${req.headers['x-forwarded-host']||req.headers['host']||`localhost:${PORT}`}`;}

async function pipeStream(res,url,rng){
  try{
    const up=await fetch_(url,rng?{Range:rng}:{});
    if(up.statusCode>=400){res.writeHead(up.statusCode);res.end();return;}
    const h={'Content-Type':up.headers['content-type']||'video/mp2t','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
    if(up.headers['content-length'])h['Content-Length']=up.headers['content-length'];
    if(up.headers['content-range'])h['Content-Range']=up.headers['content-range'];
    res.writeHead(up.statusCode===206?206:200,h);
    up.pipe(res);
    up.on('error',()=>{if(!res.writableEnded)res.end();});
  }catch(e){
    if(!res.headersSent)json(res,502,{error:e.message});
  }
}

http.createServer(async(req,res)=>{
  cors(res);
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  const u=new URL(req.url,'http://x'),path=u.pathname,pb=pub(req);

  if(path==='/health')return json(res,200,{ok:true,channels:6});

  if(path==='/channels')return json(res,200,{channels:Object.entries(CH).map(([n,c])=>({
    num:+n,name:c.name,
    q:Object.entries(c.q).map(([q,id])=>({q,stream:`${pb}/stream/${n}/${q}`,hls:`${pb}/hls/${n}/${q}`}))
  }))});

  // /hls/:ch/:q
  const hM=path.match(/^\/hls\/(\d+)\/(\w+)$/);
  if(hM){
    const[,c,q]=hM;const id=CH[+c]?.q?.[q];
    if(!id)return json(res,404,{error:'not found'});
    const m3u8url=getM3U8Url(id);
    try{
      const up=await fetch_(m3u8url);
      if(up.statusCode===200){
        const raw=await readAll(up);
        if(raw.includes('#EXTM3U')||raw.includes('#EXT-X')){
          res.writeHead(200,{'Content-Type':'application/vnd.apple.mpegurl','Cache-Control':'no-cache'});
          return res.end(rewrite(raw,m3u8url,pb));
        }
      }
    }catch{}
    // fallback M3U8
    res.writeHead(200,{'Content-Type':'application/vnd.apple.mpegurl','Cache-Control':'no-cache'});
    return res.end(`#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:10\n#EXT-X-MEDIA-SEQUENCE:0\n#EXTINF:10,\n${pb}/stream/${c}/${q}\n`);
  }

  // /stream/:ch/:q
  const tM=path.match(/^\/stream\/(\d+)\/(\w+)$/);
  if(tM){
    const[,c,q]=tM;const id=CH[+c]?.q?.[q];
    if(!id)return json(res,404,{error:'not found'});
    console.log(`[▶] ch=${c} q=${q} id=${id}`);
    return pipeStream(res,getStreamUrl(id),req.headers['range']);
  }

  // /seg?u=
  if(path==='/seg'){
    const url=decodeURIComponent(u.searchParams.get('u')||'');
    if(!url)return json(res,400,{error:'missing u'});
    return pipeStream(res,url,req.headers['range']);
  }

  // /m3u?u=
  if(path==='/m3u'){
    const url=decodeURIComponent(u.searchParams.get('u')||'');
    if(!url)return json(res,400,{error:'missing u'});
    try{
      const up=await fetch_(url);const raw=await readAll(up);
      res.writeHead(200,{'Content-Type':'application/vnd.apple.mpegurl','Cache-Control':'no-cache'});
      res.end(rewrite(raw,url,pb));
    }catch{if(!res.headersSent){res.writeHead(502);res.end();}}
    return;
  }

  json(res,404,{routes:['/health','/channels','/stream/:ch/:q','/hls/:ch/:q']});

}).listen(PORT,'0.0.0.0',()=>{
  console.log(`WC2026 Proxy running on port ${PORT}`);
});
