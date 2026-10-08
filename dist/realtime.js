(function(){
 const cfg=window.PREMIERE_ENV||{}, online=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase);
 const db=online?window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
 const bus="BroadcastChannel"in window?new BroadcastChannel("premiere-checkin"):null;
 const decodeName=value=>{if(!value)return"";try{const padded=value.replaceAll("-","+").replaceAll("_","/").padEnd(Math.ceil(value.length/4)*4,"=");const binary=atob(padded),bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));return new TextDecoder().decode(bytes)}catch{return""}};
 const parse=raw=>{try{const u=new URL(raw),compactName=u.searchParams.get("n");return{id:u.searchParams.get("t")||u.searchParams.get("ticket")||raw,name:compactName?decodeName(compactName):u.searchParams.get("name")||"",number:u.searchParams.get("o")||u.searchParams.get("number")||""}}catch{return{id:raw.trim(),name:"",number:""}}};
 async function registerGuest(ticket){
   if(db){const{data,error}=await db.rpc("register_guest",{p_ticket_id:ticket.ticketId,p_guest_name:ticket.name,p_ticket_number:ticket.number});if(error)throw error;return data}
   return ticket;
 }
 async function checkIn(raw){
   const parsed=parse(raw),id=parsed.id;
   if(db){const{data,error}=await db.rpc("check_in_ticket",{p_ticket_id:id});if(error)throw error;return data}
   const fixed=window.PREMIERE.tickets.find(x=>x.ticketId===id);
   const t=fixed||(id.startsWith("GMH-2026-O-")&&parsed.name?{ticketId:id,name:parsed.name,number:parsed.number||id.slice(-4),type:"guest",role:"PREMIERE GUEST"}:null);
   if(!t)return{status:"invalid",ticket_id:id};
   const key=`premiere-used:${id}`,old=localStorage.getItem(key);if(old)return{status:"used",...t,checked_in_at:old};
   const now=new Date().toISOString(),result={status:"valid",...t,checked_in_at:now};localStorage.setItem(key,now);localStorage.setItem("premiere-last-checkin",JSON.stringify(result));bus?.postMessage(result);return result;
 }
 function subscribe(fn){
   if(db){const ch=db.channel("premiere-display").on("postgres_changes",{event:"INSERT",schema:"public",table:"checkins"},p=>fn(p.new)).subscribe();db.from("checkins").select("*").order("checked_in_at",{ascending:false}).limit(1).maybeSingle().then(({data})=>data&&fn(data));return()=>db.removeChannel(ch)}
   const saved=localStorage.getItem("premiere-last-checkin");if(saved)fn(JSON.parse(saved));if(bus)bus.onmessage=e=>fn(e.data);window.addEventListener("storage",e=>e.key==="premiere-last-checkin"&&e.newValue&&fn(JSON.parse(e.newValue)));return()=>bus?.close();
 }
 window.PREMIERE_API={checkIn,subscribe,registerGuest,configured:online};
})();
