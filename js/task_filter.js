var filterBox = document.querySelectorAll(".div-task-span");

function onTypeSelectionChange(select) {
    var selectedOption = select.options[select.selectedIndex].value;
    var filterClass = 'filter-type_' + selectedOption;

    filterBox.forEach( elem => {
        elem.classList.remove('hide');
       if(!elem.classList.contains(filterClass) && selectedOption !== 'Выберите тип'){
           elem.classList.add('hide');
    }
    });
}
