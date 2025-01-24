const UI_Table_Array = [ 
"Ai",
"Ai Profiles",
"Animation",
"Armor",
"Asteroid",
"Autopilot",
"Cheats",
"Colors",
"Control Config Defaults",
"Credits",
"Curves",
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
"Music",
"Muzzle Flash",
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

const UI_TABLE_INDEX =[ 
1, 
2, 
50, 
3, 
4, 
5, 
6, 
7, 
9,
51, 
8,
10, 
11,
45, 
12, 
13, 
14, 
15, 
16, 
17, 
18, 
19, 
20, 
21, 
22, 
23, 
24, 
25, 
27, 
26, 
28, 
29,
30, 
31, 
52, 
32, 
33, 
34, 
35, 
36, 
37, 
38, 
39, 
40, 
41, 
42, 
43, 
44, 
49, 
46, 
47, 
48
]

document.addEventListener( "scroll", (event) => { adjustFloater(); } );
window.addEventListener( "resize", (event) => { adjustFloater(); } );

async function populate_floater_links(){
    for (let i = 0; i < 52; i++) {
        changeContents(`floater-link-${i}`, UI_Table_Array[i]);
    }
}

function setTableViaFloater(id) {
    if (id < 0 || id > 52){
        return;
    }

    // this first so that the info we enable will have an existing place to be.
    setPageMode("tables");

    apply_table(UI_TABLE_INDEX[id] - 1);

}


function adjustFloater(){
    let element = document.getElementById("floating-link-container");
  
    if (window.scrollY > 300){
        element.style.top = "70px";
        element.style.minHeight = `${window.innerHeight - 70 - 30}px`;
        element.style.maxHeight = `${window.innerHeight - 70 - 30}px`;
    } else {
        const top = ((300 - window.scrollY) / 350) * 300 + 70;

        element.style.top = `${top}px`;
        element.style.minHeight = `${window.innerHeight - top - 30}px`;
        element.style.maxHeight = `${window.innerHeight - top - 30}px`;
    }
  }