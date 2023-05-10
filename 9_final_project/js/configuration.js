let list = `Flag_baseColor.png
Material.002_diffuse.png
wood_015_ash_Base_Color.jpeg
wood_beech_honey_Base_Color.jpeg`.split('\n');
let configuration = {
    "modelDir": "./model/",
    "modelURLs": [
        "puzzle.json",
        "flag.json",
        //"knight.json",
        //"boxaqua.json",
        //"balloon.json",
        //"crate.json",

    ],
    "blockSet": new Set(),
    "textureNames": list,
}


export {configuration};