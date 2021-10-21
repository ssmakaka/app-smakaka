let a = new XMLHttpRequest();
a.onload = function () {
    let tasks = JSON.parse(a.responseText);
    console.log(tasks);
    for (let task of tasks) {
        createRow(task.title, task.done, task.category, task.id);
    }

}
a.open("GET", "https://todoappexamplejs.herokuapp.com/items.json");
a.send();


function createItem(tag, className, parentItem, text) {
    let temp = document.createElement(tag);
    temp.className = className;
    temp.innerText = text;
    parentItem.appendChild(temp);
    return temp;
}

function createRow(text, status, category, id) {
    let liTask = createItem("div", "row li-task", divContainer, "");
    let divCheckbox = createItem("div", "col-lg-1", liTask, "");
    let inputCheckbox = createItem("input", "", divCheckbox, "");
    inputCheckbox.type = "checkbox";
    let divTextTask = createItem("div", "col-lg-5", liTask, "");
    let textTask = createItem("div", "text-task", divTextTask, text);
    let textCategory = createItem("small", "", divTextTask, category);
    let divEdit = createItem("div", "col-lg-2", liTask, '');
    let buttonEdit = createItem("button", "btn btn-link", divEdit, "Edit");
    let divDelete = createItem("div", "col-lg-2", liTask, "");
    let buttonDelete = createItem("button", "btn btn-danger", divDelete, "Delete");

    if (status == true) {
        textTask.className = "done";
        inputCheckbox.checked = status;
    } else {
        textTask.className = "undone";
        inputCheckbox.checked = status;
    };

    inputCheckbox.addEventListener('click', () => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function () {
            textTask.className = "done";
        };
        xmlHttp.open("PUT", "https://todoappexamplejs.herokuapp.com/items/" + id);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.setRequestHeader("Accept", "application/json");
        xmlHttp.send(JSON.stringify({
            done: inputCheckbox.checked
        }));
        if (inputCheckbox.checked == true) {
            textTask.className = "done";
        } else {
            textTask.className = "undone";
        }

    });

    buttonDelete.addEventListener('click', () => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function () {
            liTask.remove();
        };
        xmlHttp.open("DELETE", "https://todoappexamplejs.herokuapp.com/items/" + id);
        xmlHttp.setRequestHeader("Accept", "application/json");
        xmlHttp.send();
    });


    buttonEdit.addEventListener("click", () => {
        let inputEdit = createItem("input", "form-control", divTextTask, '');
        divTextTask.prepend(inputEdit);
        inputEdit.value = textTask.innerText;
        textTask.innerText = "";
        let inputEditCategory = createItem("input", "form-control", divTextTask, '');
        inputEditCategory.value = textCategory.innerText;
        textCategory.innerText = "";
        buttonEdit.className = "btn btn-link disabled";


        function addEdit() {
            textTask.innerText = inputEdit.value;
            inputEdit.remove();
            buttonEdit.className = "btn btn-link";
            textCategory.innerText = inputEditCategory.value;
            inputEditCategory.remove();
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onload = function () {

            };
            xmlHttp.open("PUT", "https://todoappexamplejs.herokuapp.com/items/" + id);
            xmlHttp.setRequestHeader("Content-Type", "application/json");
            xmlHttp.setRequestHeader("Accept", "application/json");
            xmlHttp.send(JSON.stringify({
                title: textTask.innerText,
                done: false,
                category: textCategory.innerText,
                id: ""
            }));
        }
        inputEdit.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                addEdit();
            };
        });
        inputEditCategory.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {

                addEdit();
            };
        });
        //Редактирование задач
    });

};
let inputText = document.querySelector("input[type='text'].texttask");
let inputCategory = document.querySelector("input[type='text'].category");
let ul = document.querySelector("ul");
let form = document.querySelector("form");
let divContainer = document.querySelector(".all-task");


form.addEventListener("submit", function (event) {
    event.preventDefault();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function () {
        createRow(inputText.value, false, inputCategory.value, "");
        inputText.value = "";
    };
    xmlHttp.open("POST", "https://todoappexamplejs.herokuapp.com/items");
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.send(JSON.stringify({
        title: inputText.value,
        done: false,
        category: inputCategory.value,
        id: ""
    }));

});
