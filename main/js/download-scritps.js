const fallbackVersion = "1.0.0"

const buildMatrix = {
  windows: {
    arm64Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-${fallbackVersion}-arm64.exe`,
      version: `${fallbackVersion}`
    },
    x64Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-${fallbackVersion}-x64.exe`,
      version: `${fallbackVersion}`
    },
    x86Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-${fallbackVersion}-x86.exe`,
      version: `${fallbackVersion}`
    },
    arm64: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Windows_arm64.zip`,
      version: `${fallbackVersion}`
    },
    x64: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Windows_x64.zip`,
      version: `${fallbackVersion}`
    },
    x86: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Windows_x86.zip`,
      version: `${fallbackVersion}`
    }
  },
  linux: {
    arm64Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-aarch64.AppImage`,
      version: `${fallbackVersion}`
    },
    x64Installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-x86_64.AppImage`,
      version: `${fallbackVersion}`
    },
    arm64: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Linux_arm64.tar.gz`,
      version: `${fallbackVersion}`
    },
    x64: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Linux_x64.tar.gz`,
      version: `${fallbackVersion}`
    }
  },
  macos: {
    installer: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/Knossos.NET-${fallbackVersion}.dmg`,
      version: `${fallbackVersion}`
    },
    appleSilicon: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/MacOS_arm64.tar.gz`,
      version: `${fallbackVersion}`
    },
    intel: {
      url: `https://github.com/KnossosNET/Knossos.NET/releases/download/v${fallbackVersion}/MacOS_x64.tar.gz`,
      version: `${fallbackVersion}`
    }
  }
}


// Run at the start of the page (called from the html) with our best guess at Architecture
function initPage(arch){
  const oldTheme = getCookie("theme");

  if (oldTheme){
    setPageTheme(oldTheme)
  }

  populateFields(false);

  fetch("https://api.github.com/repos/KnossosNET/Knossos.NET/releases/latest")
    .then((response) => response.json())
    .then(responseJSON => { get_info(responseJSON); populateFields(true); })
    .catch (error => console.log(`Fetching the most recent build from the github api failed. The error encountered was: ${error}`));
  
  // still looking for a good ARM list.  Hopefully defaulting to ARM and detecting the other two is enough.
  const arch64List = ["EM64T", "x86-64", "Intel 64", "amd64"];
  const arch32List = ["ia32", "x86", "amd32"];

  let archResult = 0;

  if (arch64List.includes(arch)) {
    archResult = 64;
  } else if (arch32List.includes(arch)){
    archResult = 32;
  }

  initOsChoice(archResult);
  toggleContents(false, "cover");
}

// Change tab appearance and download link contents
function changeActivation(enable, id, id2){
  
  toggleSelectedTab(enable, id2);
  toggleContents(enable, id);
}

// Change the appearance of the tab based on whether it's selected.
function toggleSelectedTab(enable, id2){
  const element = document.getElementById(id2);

  if (enable === true){
    element.style.fontWeight = 'bold';
    element.style.backgroundColor = "#121212";
  } else if (enable === false){
    element.style.fontWeight = 'normal';
    element.style.backgroundColor = "#080808";
  }
}

// Switch the download link contents on or off.
function toggleContents(enable, id)
{
  const element = document.getElementById(id);

  if (enable === true){
    element.style.display = 'inline';
  } else if (enable === false){
    element.style.display = 'none';
  }
}

// Disable the auto detected downoad because we are not confident enough to have the correct choice.
function disableTheButton(){
  toggleContents(false, "downLinks");
  toggleContents(false, "downloadTab");
}


function activateDownload(){
  // turn on autodetect
  changeActivation(true, "downLinks", "downTab")

  // turn off everything else
  changeActivation(false, "macLinks", "macTab");
  changeActivation(false, "linLinks", "linTab");
  changeActivation(false, "winLinks", "winTab");

}

function activateWindows(){
  // turn on windows
  changeActivation(true, "winLinks", "winTab");

  // turn off everything else
  changeActivation(false, "macLinks", "macTab");
  changeActivation(false, "linLinks", "linTab");
  changeActivation(false, "downLinks", "downTab")
}

function activateMac(){
  // Turn on macOS
  changeActivation(true, "macLinks", "macTab");

  // turn off everything else
  changeActivation(false, "linLinks", "linTab");
  changeActivation(false, "winLinks", "winTab");
  changeActivation(false, "downLinks", "downTab")
}

function activateLinux(){
  // turn on linux
  changeActivation(true, "linLinks", "linTab");

  // turn off everything else
  changeActivation(false, "winLinks", "winTab");
  changeActivation(false, "macLinks", "macTab");
  changeActivation(false, "downLinks", "downTab")
}

let detectedOS = -1;
let detectedArch = -1;

// borrowed from Vlad Turak
// https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
// Despite us having the other library for detecting these settings, this has worked well enough so far
function initOsChoice(archResult) {
  const userAgent = window.navigator.userAgent,
      platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  // save arch result for later
  detectedArch = archResult;

  if (macosPlatforms.indexOf(platform) !== -1) {
    detectedOS = 1;
    activateMac();
    activateTheButton();
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    activateMac();
    disableTheButton(); // No ios builds, so user must pick if they want one.
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    detectedOS = 0;
    activateWindows();
    activateTheButton();
  } else if (/Android/.test(userAgent)) {
    activateWindows();
    disableTheButton(); // No android builds, so user must pick if they want one.
  } else if (/Linux/.test(platform)) {
    detectedOS = 2;
    activateLinux();
    activateTheButton();
  }
}

function activateTheButton(){

  const os = detectedOS;
  const arch = detectedArch;

  // sanity!
  if (os < 0 || os > 2){
    disableTheButton();
    return;
  }

  const anchorElement = document.getElementById("theButton");
  // Download Link contents
  let newContents = '';
  // Contents for notes *after* the download link
  let noteContents = "";

  // arch 0 means ARM, 32 means 32 bit, 64 means 64 bit

  // Windows
  if (os === 0) {
    if (arch === 0){
      newContents += `${buildMatrix.windows.arm64Installer.version} Windows ARM64 Installer`;
      anchorElement.href = buildMatrix.windows.arm64Installer.url;

    } else if (arch === 32) {
      newContents += `${buildMatrix.windows.x86Installer.version} Windows 32 Bit Installer`;
      anchorElement.href = buildMatrix.windows.x86Installer.url;
    
    } else if (arch === 64) {
      newContents += `${buildMatrix.windows.x64Installer.version} Windows 64 Bit Intel Installer`;
      anchorElement.href = buildMatrix.windows.x64Installer.url;

    // Bogus Windows arch
    }  else {
      disableTheButton();
      return;
    }

  // Mac
  } else if (os === 1) {

    // Because of universal build, handle both situations at once.
    if (arch === 0 || arch === 64) {  
      newContents += `${buildMatrix.macos.installer.version} macOS Universal DMG`;
      anchorElement.href = buildMatrix.macos.installer.url;

    } else if (arch === 32) {
      // Unsuppoted
      disableTheButton();

    // Bogus Mac Arch (Or so old that we're wondering how they're still using it)
    } else {
      disableTheButton();
      return;
    }

  // Linux
  } else if (os === 2) {
    if (arch === 0) {
      newContents +=  `${buildMatrix.linux.arm64Installer.version} Linux aarch64 AppImage`;
      anchorElement.href = buildMatrix.linux.arm64Installer.url;

    } else if (arch === 32) {
        // Unsupported
        disableTheButton();

    } else if (arch === 64) {
      newContents += `${buildMatrix.linux.x64Installer.version} Linux x86_64 AppImage`;
      anchorElement.href = buildMatrix.linux.x64Installer.url;

    // Bogus Linux Arch
    } else {
      disableTheButton();
      return;
    }

    noteContents += "NOTE: When using these images in combination with appimaged or other management system, we recommend disabling auto-update in the Knossos settings tab."

    // Bad OS, somehow
  } else {
//    console.log("really really not detected!");
    disableTheButton();
    return;
  }

  // Set download link text
  document.getElementById("theButtonText").textContent = newContents;

  // Add some final text, explaining the use of other tabs
  document.getElementById("button-extra-text").textContent = noteContents;

  // Go ahead and let the user see it
  activateDownload();
}

function populateFields(populateAutoUpdate){
  document.getElementById("winarm-installer-version").textContent = buildMatrix.windows.arm64Installer.version;
  document.getElementById("winx64-installer-version").textContent = buildMatrix.windows.x64Installer.version;
  document.getElementById("winx86-installer-version").textContent = buildMatrix.windows.x86Installer.version;
  document.getElementById("winarm-pack-version").textContent = buildMatrix.windows.arm64.version;
  document.getElementById("winx64-pack-version").textContent = buildMatrix.windows.x64.version;
  document.getElementById("winx86-pack-version").textContent = buildMatrix.windows.x86.version;

  document.getElementById("winarm-installer-link").href = buildMatrix.windows.arm64Installer.url;
  document.getElementById("winx64-installer-link").href = buildMatrix.windows.x64Installer.url;
  document.getElementById("winx86-installer-link").href = buildMatrix.windows.x86Installer.url;
  document.getElementById("winarm-pack-link").href = buildMatrix.windows.arm64.url;
  document.getElementById("winx64-pack-link").href = buildMatrix.windows.x64.url;
  document.getElementById("winx86-pack-link").href = buildMatrix.windows.x86.url;


  document.getElementById("macuni-version").textContent = buildMatrix.macos.installer.version;
  document.getElementById("macapplesilicon-version").textContent = buildMatrix.macos.appleSilicon.version;
  document.getElementById("macintel-version").textContent = buildMatrix.macos.intel.version;

  document.getElementById("macuni-link").href = buildMatrix.macos.installer.url;
  document.getElementById("macapplesilicon-link").href = buildMatrix.macos.appleSilicon.url;
  document.getElementById("macintel-link").href = buildMatrix.macos.intel.url;


  document.getElementById("linuxarm-appimage-version").textContent = buildMatrix.linux.arm64Installer.version;
  document.getElementById("linuxx64-appimage-version").textContent = buildMatrix.linux.x64Installer.version;
  document.getElementById("linuxarm-binaries-version").textContent = buildMatrix.linux.arm64.version;
  document.getElementById("linuxx64-binaries-version").textContent = buildMatrix.linux.x64.version;

  document.getElementById("linuxarm-appimage-link").href = buildMatrix.linux.arm64Installer.url;
  document.getElementById("linuxx64-appimage-link").href = buildMatrix.linux.x64Installer.url;
  document.getElementById("linuxarm-binaries-link").href = buildMatrix.linux.arm64.url;
  document.getElementById("linuxx64-binaries-link").href = buildMatrix.linux.x64.url;

    if (populateAutoUpdate){
      activateTheButton();
    }
  }

function get_info(response){
  //console.log(response);

  if (!response || !response.hasOwnProperty("assets")){

    console.log("Early return. Response is null or does not have assets");
    return;
  }

  let newVersion = fallbackVersion;

  if (response.hasOwnProperty("tag_name")){
    // Our tag names have the v, but in a lot of places we don't need it, so cut it off.
    if (response.tag_name[0] === `v`){
      newVersion = response.tag_name.slice(-response.tag_name.length + 1);
    } else {
      newVersion = response.tag_name;
    }
  }

  // return if we already have this version.
  if (newVersion === fallbackVersion){
    return;
  }

  let x = 0;

  while (x < response.assets.length){
    if (!response.assets[x].hasOwnProperty("name") || !response.assets[x].hasOwnProperty("browser_download_url")){
      continue;
    }

    if (response.assets[x].name.endsWith("arm64.exe")){
      buildMatrix.windows.arm64Installer.version = newVersion;
      buildMatrix.windows.arm64Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith("x64.exe")){
      buildMatrix.windows.x64Installer.version = newVersion;
      buildMatrix.windows.x64Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith("x86.exe")){
      buildMatrix.windows.x86Installer.version = newVersion;
      buildMatrix.windows.x86Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith(".dmg")){
      buildMatrix.macos.installer.version = newVersion;
      buildMatrix.macos.installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith("aarch64.AppImage")){
      buildMatrix.linux.arm64Installer.version = newVersion;
      buildMatrix.linux.arm64Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name.endsWith("x86_64.AppImage")){
      buildMatrix.linux.x64Installer.version = newVersion;
      buildMatrix.linux.x64Installer.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="Linux_arm64.tar.gz"){
      buildMatrix.linux.arm64.version = newVersion;
      buildMatrix.linux.arm64.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="Linux_x64.tar.gz"){
      buildMatrix.linux.x64.version = newVersion;
      buildMatrix.linux.x64.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="MacOS_arm64.tar.gz"){
      buildMatrix.macos.appleSilicon.version = newVersion;
      buildMatrix.macos.appleSilicon.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="MacOS_x64.tar.gz"){
      buildMatrix.macos.intel.version = newVersion;
      buildMatrix.macos.intel.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="Windows_arm64.zip"){
      buildMatrix.windows.arm64.version = newVersion;
      buildMatrix.windows.arm64.url = response.assets[x].browser_download_url;
    } else if (response.assets[x].name==="Windows_x64.zip"){
      buildMatrix.windows.x64.version = newVersion;
      buildMatrix.windows.x64.url = response.assets[x].browser_download_url;      
    } else if (response.assets[x].name==="Windows_x86.zip"){
      buildMatrix.windows.x86.version = newVersion;
      buildMatrix.windows.x86.url = response.assets[x].browser_download_url;      
    }
    x++;
  }
}

function setPageTheme(theme){
  const validThemes = [ "Knet", "Classic", "Vishnan", "Ancients", "Nightmare", "Ae" ];

  if ( !validThemes.includes(theme) ) return;

  document.body.setAttribute('data-theme', theme);
  document.cookie = `theme=${theme}`;
}

// Borrowed from w3schools
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}