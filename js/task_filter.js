var filterBox = document.querySelectorAll(".div-task-span");

function onTypeSelectionChange(select) {

    var selectedOption = select.options[select.selectedIndex].value;

    filterBox.forEach( elem => {

        elem.classList.remove('t-h');

        if (!elem.classList.contains("m-h")){
            if (!elem.classList.contains("s-h")){
                if (!elem.classList.contains("st-h")){
                    elem.classList.remove('hide');
                }
            }
        }

        if (elem.attributes["data-filter-type"].value !== selectedOption && selectedOption !== 'all'){
            elem.classList.add('t-h');
            elem.classList.add('hide');
        }
    });
}

function onMarketerSelectionChange(select) {

    var selectedOption = select.options[select.selectedIndex].value;
    var str = ' ' + selectedOption + ' ';

    filterBox.forEach( elem => {

        elem.classList.remove("m-h");

        if (!elem.classList.contains("t-h")){
            if(!elem.classList.contains("s-h")){
                if (!elem.classList.contains("st-h")){
                    elem.classList.remove('hide');
                }
            }
        }

        if (!elem.attributes["data-filter-marketers"].value.includes(str) && selectedOption !== 'all'){
            elem.classList.add('hide');
            elem.classList.add('m-h');
        }
    });
}

function onStoreSelectionChange(select){

    var selectedOption = select.options[select.selectedIndex].value;
    var str = ' ' + selectedOption + ' ';

    filterBox.forEach( elem => {

        elem.classList.remove("s-h");

        if (!elem.classList.contains("t-h")){
            if (!elem.classList.contains("m-h")){
                if (!elem.classList.contains("st-h")){
                    elem.classList.remove('hide');
                }
            }
        }

        if (!elem.attributes["data-filter-store"].value.includes(str) && selectedOption !== 'all'){
            elem.classList.add('hide');
            elem.classList.add('s-h');
        }
    });
}

function onStatusSelectionChange(select){

    var selectedOption = select.options[select.selectedIndex].value;
    var str = ' ' + selectedOption + ' ';

    filterBox.forEach( elem => {

        elem.classList.remove("st-h");

        if (!elem.classList.contains("t-h")){
            if (!elem.classList.contains("m-h")){
                if (!elem.classList.contains("s-h")){
                    elem.classList.remove('hide');
                }
            }
        }

        if (!elem.attributes["data-filter-status"].value.includes(str) && selectedOption !== 'all'){
            elem.classList.add('hide');
            elem.classList.add('st-h');
        }
    });
}