function initiateItemEdit(id) {
    /*
    item${id}
    item${id}-text
    item${id}-major-version
    item${id}-deprecation-area
    item${id}-variable-type
    item${id}-illegal-values-area
    item${id}-alias-area
    item${id}-documentation
    item${id}-save-button
    */

    // name
    let current_element = document.getElementById(`item${id}-text`);
    changeContents(`item${id}-edit-name`, current_element.innerText);
    toggleContents(false, `item${id}-item-text-area`); 
    toggleContents(true, `item${id}-edit-name-group`);

    // version 
    current_element = document.getElementById(`item${id}-major-version`);
    changeContents(`item${id}-edit-major-version`, current_element.innerText);
    toggleContents(false, `item${id}-major-version-area`); 
    toggleContents(true, `item${id}-edit-major-version-group`);

    // Deprecations
    current_element = document.getElementById(`item${id}-major-version`);
    changeContents(`item${id}-edit-major-version`, current_element.innerText);
    toggleContents(false, `item${id}-major-version-area`); 
    toggleContents(true, `item${id}-edit-major-version-group`);

    // type
    current_element = document.getElementById(`item${id}-variable-type`);
    changeContents(`item${id}-edit-variable-type`, current_element.innerText);
    toggleContents(false, `item${id}-type-area`); 
    toggleContents(true, `item${id}-edit-variable-type-group`);

    // Illegal Values


    // Alias


    // Description

//    changeContents("item-edit-description-area", )


}

function saveItemEditChanges(id){
    console.log(`Call to editing function done. id ${id}`)
}

