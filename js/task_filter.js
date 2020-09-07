function onTypeSelectionChange(select) {
    var filterBox = document.querySelectorAll(".div-task-span");

    var selectedOption = select.options[select.selectedIndex].text;

     filterBox.forEach( elem => {

       elem.classList.remove('t-h');

        if (!elem.classList.contains("m-h")){
            if (!elem.classList.contains("r-h")){
                if (!elem.classList.contains("s-h")){
                    if (!elem.classList.contains("d-h")) {
                       elem.classList.remove('hide');
                    }
                }
            }
        }

        if (elem.attributes["data-filter-type"].value !== selectedOption && selectedOption !== 'Все типы'){

            elem.classList.add('t-h');
            elem.classList.add('hide');
        }
    });
}

function onMarketerSelectionChange(select) {
    var filterBox = document.querySelectorAll(".div-task-span");

    var selectedOption = select.options[select.selectedIndex].value;
    var str = ' ' + selectedOption + ' ';

    filterBox.forEach( elem => {

        elem.classList.remove("m-h");

        if (!elem.classList.contains("t-h")){
            if(!elem.classList.contains("r-h")){
                if (!elem.classList.contains("s-h")){
                    if (!elem.classList.contains("d-h")){
                        elem.classList.remove('hide');
                    }
                }
            }
        }

        if (!elem.attributes["data-filter-marketer"].value.includes(str) && selectedOption !== 'all'){
            elem.classList.add('hide');
            elem.classList.add('m-h');
        }
    });
}

function onRetailpointSelectionChange(select){
    var filterBox = document.querySelectorAll(".div-task-span");

    var selectedOption = select.options[select.selectedIndex].value;
    var str = ' ' + selectedOption + ' ';

    filterBox.forEach( elem => {

        elem.classList.remove("r-h");

        if (!elem.classList.contains("t-h")){
            if (!elem.classList.contains("m-h")){
                if (!elem.classList.contains("s-h")){
                    if (!elem.classList.contains("d-h")){
                        elem.classList.remove('hide');
                    }
                }
            }
        }

        if (!elem.attributes["data-filter-retailpoint"].value.includes(str) && selectedOption !== 'all'){
            elem.classList.add('hide');
            elem.classList.add('r-h');
        }
    });
}

function onStatusSelectionChange(select){
    var filterBox = document.querySelectorAll(".div-task-span");

    var selectedOption = select.options[select.selectedIndex].text;

    filterBox.forEach( elem => {

        elem.classList.remove("s-h");

        if (!elem.classList.contains("t-h")){
            if (!elem.classList.contains("m-h")){
                if (!elem.classList.contains("r-h")){
                    if (!elem.classList.contains("d-h")) {
                        elem.classList.remove('hide');
                    }
                }
            }
        }

        if (elem.attributes["data-filter-status"].value !==selectedOption && selectedOption !== 'Все статусы'){
            elem.classList.add('hide');
            elem.classList.add('s-h');
        }
    });
}

function onDateSelectionChange(select){
    var filterBox = document.querySelectorAll(".div-task-span");

    var selectedDate = select.value;

    filterBox.forEach( elem => {

        elem.classList.remove("d-h");

    if (!elem.classList.contains("t-h")){
        if (!elem.classList.contains("m-h")){
            if (!elem.classList.contains("r-h")){
                if (!elem.classList.contains("s-h")) {
                    elem.classList.remove('hide');
                }
            }
        }
    }

        if (elem.attributes["data-filter-date"].value !== selectedDate && !isEmpty(selectedDate)){
        elem.classList.add('d-h');
        elem.classList.add('hide');
        }
    })
}

function isEmpty(str) {
    if (str.trim() == '')
        return true;

    return false;
}