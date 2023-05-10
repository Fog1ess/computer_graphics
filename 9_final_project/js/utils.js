function flatten(twoDimensionalArray) {
    let result = [];
    for (let i = 0; i < twoDimensionalArray.length; i++) {
        for (let j = 0; j < twoDimensionalArray[i].length; j++) {
            result.push(twoDimensionalArray[i][j]);
        }
    }
    return result;
}

/**
 * Get values from sliders on the webpage
 * @param {String} name name of the attribute used on slider
 * @param {String} type type of parameters (translate, rotate, direction...). Empty by default
 * @returns {Number[]} 3D parameters
 */
function getParamsXYZ(name, type = "") {
    let [nameX, nameY, nameZ] = [name+type+'-x', name+type+'-y', name+type+'-z'];
    let param = new Float32Array([nameX, nameY, nameZ]
      .map(elemName => {
        let elem = document.getElementById(elemName);
        return (elem != null ? elem.value : 0.0);
      })); 
    return param;
}

/**
 * 
 * @param {string} url $tex.file in .json file
 * @returns {string} the last piece of the url (would be the file name of the texture image under "textures" folder)
 */
function lastPiece(url) {
    let pieces = url.split('\\');
    return pieces[pieces.length - 1];
}



export { flatten, getParamsXYZ, lastPiece};