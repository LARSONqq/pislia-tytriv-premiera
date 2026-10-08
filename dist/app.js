const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],norm=v=>v.trim().toLocaleLowerCase("uk-UA").replace(/[’'`-]/g,"").replace(/\s+/g," ");
let selected=null;
const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
function qr(ticket){const el=$("#qrCode"),vip=ticket.type==="teacher";el.innerHTML="";if(window.QRCode)new QRCode(el,{text:PREMIERE.qrPayload(ticket),width:104,height:104,colorDark:vip?"#17110a":"#101014",colorLight:vip?"#f7e5ac":"#ffffff",correctLevel:QRCode.CorrectLevel.H});else el.textContent=ticket.ticketId}
function show(t){selected=t;const teacher=t.type==="teacher";$("#ticket").classList.toggle("teacher-ticket",teacher);$("#ticketGuest").textContent=t.name.toLocaleUpperCase("uk-UA");$("#ticketRole").textContent=teacher?"HONORED GUEST":t.role;$("#stubRole").textContent=teacher?"VIP":"ONE";$("#stubType").textContent=teacher?"HONORED":"ADMIT";$("#stubNumber").textContent=`№ ${t.number}`;$("#ticketNumberTop").textContent=`№ ${t.number}`;$("#ticketTypeTop").textContent=teacher?"FACULTY PREMIERE PASS":"PRIVATE PREMIERE";$("#ticketIdLabel").textContent=t.ticketId;$("#ticketEyebrow").textContent=teacher?"SPECIAL INVITATION · 02":"КВИТОК СТВОРЕНО · 02";$("#ticketHeading").innerHTML=teacher?"Ваша присутність<br>має особливе значення.":"Ваше місце<br>зарезервовано.";qr(t);$("#formMessage").textContent=teacher?"VIP-статус підтверджено. Готуємо спеціальний квиток…":"Готово. Створюємо ваш персональний квиток…";$("#formMessage").className="form-message success";setTimeout(()=>go("ticketSection"),350)}
function ticketBlob(dataUrl){const base64=dataUrl.split(",")[1],raw=atob(base64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new Blob([bytes],{type:"image/png"})}
function openTicketImage(dataUrl){const tab=window.open("","_blank");if(!tab){window.location.href=dataUrl;return}const doc=tab.document;doc.title="Збережіть квиток";doc.documentElement.style.background="#050507";doc.body.style.cssText="margin:0;padding:20px;background:#050507;color:#fff;font:16px system-ui;text-align:center";const note=doc.createElement("p");note.textContent="Затисніть зображення та виберіть «Зберегти у Фото».";note.style.cssText="margin:0 auto 16px;max-width:520px";const image=doc.createElement("img");image.src=dataUrl;image.alt="Персональний квиток";image.style.cssText="display:block;width:100%;max-width:900px;height:auto;margin:auto";doc.body.append(note,image)}
function download(){
 if(!selected)return;
 const source=$("#qrCode canvas"),c=document.createElement("canvas"),x=c.getContext("2d"),vip=selected.type==="teacher";
 c.width=1800;c.height=1080;
 const rr=(px,py,w,h,r,fill,stroke)=>{x.beginPath();x.roundRect(px,py,w,h,r);if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.stroke()}};
 const label=(text,px,py,color=vip?"#caa956":"#686976")=>{x.fillStyle=color;x.font="700 18px Arial";x.fillText(text,px,py)};
 const value=(text,px,py,size=26,color=vip?"#fff2c5":"#101017")=>{x.fillStyle=color;x.font=`700 ${size}px Arial`;x.fillText(text,px,py)};
 const fit=(text,px,py,max,size,color)=>{x.font=`800 ${size}px Arial`;while(x.measureText(text).width>max&&size>22){size-=2;x.font=`800 ${size}px Arial`}x.fillStyle=color;x.fillText(text,px,py)};
 x.fillStyle="#050507";x.fillRect(0,0,c.width,c.height);
 const glow=x.createRadialGradient(vip?1380:300,220,20,vip?1380:300,220,800);glow.addColorStop(0,vip?"rgba(218,172,63,.20)":"rgba(255,70,56,.18)");glow.addColorStop(1,"rgba(5,5,7,0)");x.fillStyle=glow;x.fillRect(0,0,c.width,c.height);
 x.fillStyle=vip?"#caa956":"#ff4638";x.fillRect(100,75,90,8);x.fillStyle="#f5f5f7";x.font="700 20px Arial";x.fillText("GOOD MOODLE HUNTING  /  PRIVATE PREMIERE",210,84);
 x.fillStyle="#6f707b";x.textAlign="right";x.fillText("09 · 10 · 2026",1700,84);x.textAlign="left";
 if(vip){
   const metal=x.createLinearGradient(110,140,1690,1040);metal.addColorStop(0,"#171713");metal.addColorStop(.45,"#070708");metal.addColorStop(.72,"#18140b");metal.addColorStop(1,"#090909");rr(110,140,1580,900,26,metal,"#c89c3d");
   x.lineWidth=2;rr(128,158,1544,864,18,null,"rgba(234,197,103,.35)");
   const gold=x.createLinearGradient(110,140,370,1040);gold.addColorStop(0,"#f7e39a");gold.addColorStop(.36,"#9c681d");gold.addColorStop(.62,"#f0ce69");gold.addColorStop(1,"#70430f");x.fillStyle=gold;x.fillRect(110,140,260,900);
   x.save();x.translate(250,930);x.rotate(-Math.PI/2);x.fillStyle="#090806";x.font="900 48px Arial";x.fillText("HONORED GUEST  ·  VIP",0,0);x.restore();
   x.fillStyle="#d7b65f";x.font="700 19px Arial";x.fillText("FACULTY PREMIERE PASS",430,215);x.textAlign="right";x.fillText(`№ ${selected.number}`,1610,215);x.textAlign="left";
   x.fillStyle="#f0cb68";x.font="900 78px Arial";x.fillText("GOOD MOODLE",430,345);x.fillText("HUNTING",430,430);
   label("ЦЕЙ VIP-КВИТОК НАЛЕЖИТЬ",430,500);fit(selected.name.toLocaleUpperCase("uk-UA"),430,570,820,58,"#fff7df");
   x.strokeStyle="rgba(211,174,78,.52)";x.beginPath();x.moveTo(430,610);x.lineTo(1610,610);x.stroke();
   label("ДАТА",430,664);value("9 ЖОВТНЯ 2026",430,704);label("ЧАС",760,664);value("10:00",760,704);label("СТАТУС",970,664);value("HONORED GUEST",970,704,23);
   label("МІСЦЕ",430,770);value("УБТС · НОВА БІБЛІОТЕКА",430,810,22);x.fillStyle="#aaa393";x.font="19px Arial";x.fillText("вул. Мельника, 21",430,842);
   label("DRESS CODE",430,886);value("ШО ПОПАЛО",430,920,21);
   if(source){x.fillStyle="#f7e5ac";rr(1360,650,250,250,8,"#f7e5ac","#c89c3d");x.drawImage(source,1375,665,220,220)}
   x.fillStyle="rgba(202,169,86,.12)";x.font="900 120px Arial";x.fillText("VIP",1060,465);
   x.fillStyle="#d4ad50";x.font="700 20px monospace";x.fillText("ACT III: UNLOCKED",1080,515);x.fillStyle="#858173";x.font="16px monospace";x.fillText("Further instructions classified.",1080,546);
   x.fillStyle="#777164";x.font="15px monospace";x.fillText(`ID  ${selected.ticketId}`,1080,920);
 }else{
   rr(110,140,1580,900,24,"#e9eaee","#34343c");x.fillStyle="#ff4638";x.fillRect(110,140,250,900);
   x.save();x.translate(250,940);x.rotate(-Math.PI/2);x.fillStyle="#0b0b10";x.font="900 50px Arial";x.fillText("ADMIT ONE  ·  PREMIERE PASS",0,0);x.restore();
   for(let py=176;py<1020;py+=42){x.beginPath();x.arc(360,py,8,0,Math.PI*2);x.fillStyle="#050507";x.fill()}
   x.fillStyle="#62636f";x.font="700 19px Arial";x.fillText("PRIVATE PREMIERE  ·  OFFICIAL ENTRY PASS",430,215);x.textAlign="right";x.fillText(`№ ${selected.number}`,1610,215);x.textAlign="left";
   x.fillStyle="#101017";x.font="900 76px Arial";x.fillText("GOOD MOODLE HUNTING",430,365);
   x.fillStyle="#ff4638";x.fillRect(430,404,82,7);
   label("ЦЕЙ КВИТОК НАЛЕЖИТЬ",430,480);fit(selected.name.toLocaleUpperCase("uk-UA"),430,555,920,60,"#101017");
   x.strokeStyle="#b8bac2";x.beginPath();x.moveTo(430,600);x.lineTo(1610,600);x.stroke();
   label("ДАТА",430,660);value("9 ЖОВТНЯ 2026",430,702);label("ДВЕРІ",770,660);value("09:50",770,702);label("ПОЧАТОК",980,660);value("10:00",980,702);label("СТАТУС",1190,660);value("PREMIERE GUEST",1190,702,21);
   label("МІСЦЕ",430,790);value("УБТС · НОВА БІБЛІОТЕКА",430,832,22);x.fillStyle="#686976";x.font="19px Arial";x.fillText("вул. Мельника, 21",430,866);
   label("DRESS CODE",900,790);value("ШО ПОПАЛО",900,832,23);x.fillStyle="#686976";x.font="17px Arial";x.fillText("Будь-який образ · головне приходьте",900,866);
   if(source){rr(1370,735,240,240,8,"#fff","#15151a");x.drawImage(source,1385,750,210,210)}
   x.fillStyle="#6f707b";x.font="15px monospace";x.fillText(`TICKET ID  ${selected.ticketId}`,430,916);
   x.textAlign="right";x.fillStyle="#ff4638";x.font="700 17px Arial";x.fillText("ОДИН КВИТОК · ОДИН CHECK-IN",1320,916);x.textAlign="left";
 }
 x.fillStyle=vip?"#caa956":"#ff4638";x.font="700 19px Arial";x.fillText(vip?"ACT III ACCESS GRANTED":"ВАША ІСТОРІЯ ЩЕ НЕ ЗАКІНЧИЛАСЬ.",430,1012);
 x.textAlign="right";x.fillStyle=vip?"#858173":"#676873";x.font="16px Arial";x.fillText("Покажіть QR-код організатору при вході",1650,1012);x.textAlign="left";
 const filename=`${vip?"VIP-Квиток":"Квиток"}-${selected.name.replaceAll(" ","-")}.png`,dataUrl=c.toDataURL("image/png"),blob=ticketBlob(dataUrl),file=typeof File==="function"?new File([blob],filename,{type:"image/png"}):null,mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
 if(mobile&&file&&navigator.share&&navigator.canShare?.({files:[file]})){navigator.share({files:[file],title:"Квиток на прем’єру «Good Moodle Hunting»"}).catch(error=>{if(error.name!=="AbortError")openTicketImage(dataUrl)});return}
 if(mobile){openTicketImage(dataUrl);return}
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.download=filename;a.href=url;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function makeOpenTicket(name){const key=`good-moodle-hunting-ticket:${norm(name)}`,saved=localStorage.getItem(key);if(saved)return JSON.parse(saved);const suffix=(crypto.randomUUID?.()||Math.random().toString(36).slice(2)).replaceAll("-","").slice(0,10).toUpperCase();const ticket={ticketId:`GMH-2026-O-${suffix}`,name:name.trim(),number:`O${suffix.slice(-4)}`,type:"guest",role:"PREMIERE GUEST"};localStorage.setItem(key,JSON.stringify(ticket));return ticket}
$("#startButton").onclick=()=>go("lookup");$$("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));$("#saveTicket").onclick=download;
$("#guestForm").onsubmit=async e=>{e.preventDefault();const name=$("#guestName").value.trim();if(name.length<2){$("#formMessage").textContent="Введіть ім’я, яке буде надруковане на квитку.";return}const vip=PREMIERE.vipGuests.find(x=>norm(x.name)===norm(name)),ticket=vip||makeOpenTicket(name);$("#formMessage").textContent="Створюємо унікальний квиток…";$("#formMessage").className="form-message success";try{if(!vip)await PREMIERE_API.registerGuest(ticket);show(ticket)}catch{$("#formMessage").textContent="Не вдалося створити квиток. Спробуйте ще раз.";$("#formMessage").className="form-message"}};
