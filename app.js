const $=id=>document.getElementById(id);
let faceUrl=null,targetUrl=null;
function showStatus(message){$("status-message").textContent=message}
function shortName(name){return name.length>28?name.slice(0,25)+"…":name}
function clearPreview(url){if(url)URL.revokeObjectURL(url)}
function setupSource(){
 const input=$("face-input"),preview=$("face-preview"),title=$("face-title"),drop=$("face-drop"),clear=$("clear-face");
 input.addEventListener("change",()=>{
  const file=input.files&&input.files[0];if(!file)return;
  if(!file.type.startsWith("image/")){showStatus("Please choose an image for the source face.");input.value="";return}
  clearPreview(faceUrl);faceUrl=URL.createObjectURL(file);preview.src=faceUrl;preview.hidden=false;
  drop.classList.add("has-media");title.textContent=shortName(file.name);drop.querySelector(".upload-symbol").hidden=true;
  drop.querySelector("small").textContent=(file.size/1048576).toFixed(1)+" MB · selected";clear.hidden=false;
  showStatus("Source portrait selected. Now choose a target photo or video.")
 });
 clear.addEventListener("click",()=>{
  input.value="";preview.removeAttribute("src");preview.hidden=true;drop.classList.remove("has-media");
  drop.querySelector(".upload-symbol").hidden=false;drop.querySelector("small").textContent="JPG, PNG, WEBP";
  title.textContent="Choose a photo";clear.hidden=true;clearPreview(faceUrl);faceUrl=null;
  showStatus("Source portrait removed.")
 })
}
function setupTarget(){
 const input=$("target-input"),image=$("target-image-preview"),video=$("target-video-preview"),title=$("target-title"),drop=$("target-drop"),clear=$("clear-target");
 input.addEventListener("change",()=>{
  const file=input.files&&input.files[0];if(!file)return;
  const isImage=file.type.startsWith("image/"),isVideo=file.type.startsWith("video/");
  if(!isImage&&!isVideo){showStatus("Choose a supported photo or video file.");input.value="";return}
  clearPreview(targetUrl);targetUrl=URL.createObjectURL(file);
  image.hidden=true;video.hidden=true;image.removeAttribute("src");video.removeAttribute("src");
  const preview=isImage?image:video;preview.src=targetUrl;preview.hidden=false;
  drop.classList.add("has-media");title.textContent=shortName(file.name);drop.querySelector(".upload-symbol").hidden=true;
  drop.querySelector("small").textContent=(file.size/1048576).toFixed(1)+" MB · "+(isImage?"photo":"video")+" selected";
  clear.hidden=false;showStatus("Target "+(isImage?"photo":"video")+" selected. Inputs can be checked below.")
 });
 clear.addEventListener("click",()=>{
  input.value="";image.removeAttribute("src");video.removeAttribute("src");image.hidden=true;video.hidden=true;
  drop.classList.remove("has-media");drop.querySelector(".upload-symbol").hidden=false;
  drop.querySelector("small").textContent="JPG, PNG, WEBP, MP4, WEBM, MOV";
  title.textContent="Choose photo or video";clear.hidden=true;clearPreview(targetUrl);targetUrl=null;
  showStatus("Target media removed.")
 })
}
setupSource();setupTarget();
$("process-button").addEventListener("click",()=>{
 const source=$("face-input").files&&$("face-input").files[0],target=$("target-input").files&&$("target-input").files[0];
 if(!source)return showStatus("Choose a source portrait first.");
 if(!target)return showStatus("Choose a target photo or video first.");
 const kind=target.type.startsWith("image/")?"photo":"video";
 showStatus("Inputs validated: source portrait + target "+kind+". AI rendering is not connected yet; no files have been uploaded.");
});
function updateNetwork(){const label=$("network-label");label.textContent=navigator.onLine?"Online · app ready":"Offline · app shell"}
window.addEventListener("online",updateNetwork);window.addEventListener("offline",updateNetwork);updateNetwork();
if("serviceWorker"in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){
 window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))
}
async function runDeviceDiagnostics(){
 const button=$("diagnostic-button"),root=$("diagnostic-results");
 button.disabled=true;button.textContent="Checking device…";
 root.replaceChildren();
 const results=[];
 const add=(name,value,detail="")=>results.push({name,value,detail});
 add("Secure context",window.isSecureContext?"Available":"Unavailable",window.isSecureContext?"HTTPS or localhost context":"WebGPU may require a secure context");
 add("WebAssembly",typeof WebAssembly!=="undefined"?"Available":"Unavailable","Possible CPU inference backend");
 add("WebGPU API",navigator.gpu?"Available":"Unavailable","Browser GPU compute interface");
 if(navigator.gpu){
  try{
   const adapter=await navigator.gpu.requestAdapter();
   add("WebGPU adapter",adapter?"Found":"Not found",adapter?"GPU adapter exposed to this browser":"API exists but no adapter was returned");
   if(adapter&&adapter.limits){
    const lim=adapter.limits.maxBufferSize;
    add("GPU buffer limit",lim?Math.round(lim/1048576)+" MiB":"Not reported","Hardware/browser limit, not a model memory guarantee");
   }
  }catch(e){add("WebGPU adapter","Check failed",String(e&&e.message||e).slice(0,120))}
 }else add("WebGPU adapter","Skipped","No WebGPU API");
 add("CPU threads",navigator.hardwareConcurrency?String(navigator.hardwareConcurrency):"Not reported","Browser-reported logical processors");
 add("Device memory",navigator.deviceMemory?navigator.deviceMemory+" GiB (browser estimate)":"Not exposed","May be hidden by the browser");
 const video=document.createElement("video");
 const formats=[
  ["MP4 / H.264",'video/mp4; codecs="avc1.42E01E"'],
  ["WebM / VP8",'video/webm; codecs="vp8"'],
  ["WebM / VP9",'video/webm; codecs="vp9"']
 ];
 for(const [name,mime] of formats)add(name,video.canPlayType(mime)||"Unknown","Playback support hint only");
 if(navigator.storage&&navigator.storage.estimate){
  try{const estimate=await navigator.storage.estimate();const free=typeof estimate.quota==="number"?Math.round(estimate.quota/1073741824*10)/10+" GiB quota":"Not reported";add("Browser storage quota",free,"Quota is not the same as free device storage")}
  catch(e){add("Browser storage quota","Unavailable","Browser did not return an estimate")}
 }else add("Browser storage quota","Not exposed","Storage estimate API unavailable");
 add("Network state",navigator.onLine?"Online now":"Offline now","Diagnostic itself makes no network request");
 const list=document.createElement("div");list.className="diagnostic-list";
 for(const item of results){
  const row=document.createElement("div");row.className="diagnostic-row";
  const left=document.createElement("div");left.className="diagnostic-label";
  const name=document.createElement("strong");name.textContent=item.name;
  const detail=document.createElement("small");detail.textContent=item.detail;
  const value=document.createElement("span");value.className="diagnostic-value";value.textContent=item.value;
  left.append(name,detail);row.append(left,value);list.append(row);
 }
 root.append(list);
 const hasGpu=results.some(x=>x.name==="WebGPU adapter"&&x.value==="Found");
 const hasWasm=typeof WebAssembly!=="undefined";
 const summary=document.createElement("p");summary.className="notice";
 summary.textContent=hasGpu?"GPU compute is exposed. Next: test a small, licence-cleared ONNX model before attempting face swapping.":hasWasm?"WebAssembly is available, but no WebGPU adapter was confirmed. A CPU-only model may be possible; performance must be measured.":"This browser does not expose the expected inference APIs.";
 root.append(summary);
 const copy=document.createElement("button");copy.type="button";copy.className="text-button";copy.textContent="Copy diagnostic report";
 copy.addEventListener("click",async()=>{
  const report=results.map(x=>x.name+": "+x.value+(x.detail?" ("+x.detail+")":"")).join("\n");
  try{await navigator.clipboard.writeText("Sririthi AI Face Studio device check\n"+report);copy.textContent="Report copied"}
  catch(e){copy.textContent="Copy unavailable. Select the results manually."}
 });
 root.append(copy);
 button.disabled=false;button.innerHTML='Run device check <span>↗</span>';
}
if($("diagnostic-button"))$("diagnostic-button").addEventListener("click",runDeviceDiagnostics);
