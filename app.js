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