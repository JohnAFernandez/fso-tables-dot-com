const UI_Table_Array = [ "Ai",
"Ai Profiles",
"Animation",
"Armor",
"Asteroid",
"Autopilot",
"Cheats",
"Colors",
"Curves",
"Control Config Defaults",
"Credits",
"Cutscenes",
"Decals",
"Default Settings",
"Fireball",
"Fonts",
"Game Settings",
"Glowpoints",
"Help",
"Hud Gauges",
"Icons",
"IFF Definitions",
"Keywords - SCPUI",
"Lighting Profiles",
"Lightning",
"Mainhall",
"Medals",
"Messages",
"Muzzle Flash",
"Music",
"Nebula",
"Object Types",
"Options",
"Particle Effects",
"Post Processing",
"Rank",
"SCPUI",
"Scripting",
"Ships",
"Sexps",
"Sounds",
"Species Definitions",
"Species/Intel Entries",
"Subspace Missile",
"Stars",
"Strings",
"Tips",
"Traitor",
"Translation Strings",
"Virtual Pofs",
"Weapon Explosion",
"Weapons" 
]

const UI_TABLE_INDEX =[ 1, 2, 50, 3, 4, 5, 6, 7, 8, 9, 10, 45, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 49, 46, 47, 48]

document.addEventListener( "scroll", (event) => { adjustFloater(); } );

async function populate_floater_links(){
    for (let i = 0; i < 51; i++) {
        changeContents(`floater-link-${i}`, UI_Table_Array[i]);
    }
}

function setTableViaFloater(id) {
    if (id < 0 || id > 51){
        return;
    }

    apply_table(UI_TABLE_INDEX[id]);
}