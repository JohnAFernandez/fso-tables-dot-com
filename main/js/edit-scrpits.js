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

    changeContents("item${id}-edit-name", current_element.innerText);
    template-item-name
    toggleContents(true, "item${id}-edit-name-group");

    // version
    current_element = document.getElementById(`item${id}-version`);
    current_element.style.display = "none";
    changeContents("item${id}-edit-name", current_element.innerText);
    toggleContents(true, "item${id}-edit-name-group");

    // type
    current_element = document.getElementById(`item${id}-text`);
    current_element.style.display = "none";
    changeContents("item${id}-edit-name", current_element.innerText);
    toggleContents(true, "item${id}-edit-name-group");


//    changeContents("item-edit-description-area", )


}

function saveItemEditChanges(id){
    console.log(`Call to editing function done. id ${id}`)
}

