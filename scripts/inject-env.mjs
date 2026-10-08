import{readFile,writeFile}from"node:fs/promises";
const t=await readFile(new URL("../dist/runtime-config.template.js",import.meta.url),"utf8");
await writeFile(new URL("../dist/runtime-config.js",import.meta.url),t.replace("__SUPABASE_URL__",process.env.VITE_SUPABASE_URL||"").replace("__SUPABASE_ANON_KEY__",process.env.VITE_SUPABASE_ANON_KEY||""));
console.log(process.env.VITE_SUPABASE_URL?"Supabase config added.":"Built in demo mode.");
