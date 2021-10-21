function createItem(tag, className, parentItem, text) {
    let temp = document.createElement(tag);
    temp.className = className;
    temp.innerText = text;
    parentItem.appendChild(temp);
    return temp;
}

function createRow(text, status, urgency, date) {
    let liTask = createItem("div", "row li-task", divContainer, "");
    let divCheckbox = createItem("div", "col-lg-1", liTask, "");
    let inputCheckbox = createItem("input", "", divCheckbox, "");
    inputCheckbox.type = "checkbox";
    inputCheckbox.checked = status;
    let divTextTask = createItem("div", "col-lg-5", liTask, "");
    let textTask = createItem("div", "text-task", divTextTask, text);
    let select = createItem("select", "form-select form-select-sm", divTextTask, "");

    select.setAttribute("disabled", "disabled");

    function createOption() {
        let valueOption = ["несрочная неважная", "несрочная важная", "срочная неважная", "срочная важная"];
        valueOption.forEach(function (item) {
            let option = createItem("option", "", select, item);
            option.value = item;
        });
    };
    createOption();
    select.value = urgency;

    let divEdit = createItem("div", "col-lg-2", liTask, '');
    let dateText = createItem("small", "", divTextTask, date);
    let buttonEdit = createItem("button", "btn btn-link", divEdit, "Edit");
    buttonEdit.type = "button";

    let divDelete = createItem("div", "col-lg-2", liTask, "");
    let buttonDelete = createItem("button", "btn btn-danger", divDelete, "Delete");
    buttonDelete.type = "button";

    if (status == true) {
        textTask.className = "done";
    } else {
        textTask.className = "undone";
    };

    inputCheckbox.addEventListener('click', () => {
        if (inputCheckbox.checked == true) {
            liTask.remove();
            divContainer.appendChild(liTask);
            textTask.className = "done";

            for (let obj of tasks) {
                if (obj.text == textTask.innerText && obj.status != inputCheckbox.checked) {
                    tasks.splice(tasks.indexOf(obj), 1);
                    tasks.push(obj);
                }
            }
        } else {
            liTask.remove();
            divContainer.prepend(liTask);
            textTask.className = "undone";
            for (let obj of tasks) {
                if (obj.text == textTask.innerText && obj.status != inputCheckbox.checked) {
                    tasks.splice(tasks.indexOf(obj), 1);
                    tasks.unshift(obj);
                }
            }
        }

        for (let obj of tasks) {
            if (obj.text == textTask.innerText && obj.status != inputCheckbox.checked) {
                obj.status = inputCheckbox.checked;
            }
        }
        localStorage.tasks = JSON.stringify(tasks);
        //Перемещение задачи в конец списка при маркировке как сделанной
    });

    buttonDelete.addEventListener('click', () => {
        liTask.remove();

        for (let obj of tasks) {
            if (obj.text == textTask.innerText && obj.status == inputCheckbox.checked) {
                tasks.splice(tasks.indexOf(obj), 1);
            }
        }
        localStorage.tasks = JSON.stringify(tasks);
    });


    buttonEdit.addEventListener("click", () => {
        let inputEdit = createItem("input", "form-control", divTextTask, '');
        divTextTask.prepend(inputEdit);
        inputEdit.value = textTask.innerText;

        textTask.innerText = "";
        buttonEdit.className = "btn btn-link disabled";
        select.removeAttribute("disabled");

        let inputDataEdit = createItem("input", "form-control", divTextTask, "");
        inputDataEdit.type = "date";
        inputDataEdit.value = dateText.innerText;
        dateText.innerText = "";

        let editItem = {};

        for (let obj of tasks) {
            if (obj.text == inputEdit.value && obj.status == inputCheckbox.checked) {
                editItem = obj;
            }
        }

        function addEdit() {
            textTask.innerText = inputEdit.value;
            inputEdit.remove();
            buttonEdit.className = "btn btn-link";
            editItem.text = textTask.innerText;
            editItem.urgency = select.value;
            select.setAttribute("disabled", "disabled");
            dateText.innerText = inputDataEdit.value;
            editItem.date = inputDataEdit.value;
            inputDataEdit.remove();
            localStorage.tasks = JSON.stringify(tasks);
        }
        inputEdit.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                addEdit();
            };
        });
        select.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                addEdit();
            };
        });
        inputDataEdit.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                addEdit();
            };
        });
        //Редактирование задач
    });

};
let inputText = document.querySelector("input[type='text']");
let ul = document.querySelector("ul");
let form = document.querySelector("form");
let divContainer = document.querySelector(".all-task");
let select = document.querySelector("select");
let dateInput = document.querySelector("input[type='date']");
let tasks = [];

if (localStorage.tasks) {
    tasks = JSON.parse(localStorage.tasks);
};

for (let task of tasks) {
    createRow(task.text, task.status, task.urgency, task.date);
};

form.addEventListener("submit", function (event) {
    event.preventDefault();
    createRow(inputText.value, false, select.value, dateInput.value);
    tasks.push({
        text: inputText.value,
        status: false,
        urgency: select.value,
        date: dateInput.value
    });
    inputText.value = "";
    dateInput.value = "";
    localStorage.tasks = JSON.stringify(tasks);
});
