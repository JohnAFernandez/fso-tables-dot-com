// Run at the start of the page (called from the html) with our best guess at Architecture
function initPage(){
  toggleContents(false, "cover");
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

function show_about()
{
  
}

/*
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
*/
/*
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
}*/