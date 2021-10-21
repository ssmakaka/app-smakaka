let responseHttp = new XMLHttpRequest();
responseHttp.onload = function () {
    let json = JSON.parse(responseHttp.responseText);
    mainSite(json);
};
responseHttp.open("GET", "https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json");
responseHttp.setRequestHeader("Accept", "application/json");
responseHttp.send();

function mainSite(li) {
    let numberPage = 1;
    let revers = 1;
    let reversName = "";
    let searchText = "";
    let filter = "all";
    let json = filterList(li, searchText, filter);
    let visibleRow = createTable(0, 20, json);
    let divAll;
    let pageArray = [];
    input.addEventListener("keyup", function () {
        searchText = input.value;
        reloadPage();
        removeArrow();
    });
    select.addEventListener("change", function () {
        filter = select.value;
        reloadPage();
        removeArrow();
    });

    function reloadPage() {
        json = filterList(li, searchText, filter);

        for (let item of visibleRow) {
            item.remove();
        }
        for (let item of pageArray) {
            item.remove();
        }
        visibleRow = createTable(0, 20, json);
        numberPage = 1;
        if (divAll != null) {
            divAll.remove();
            divAll = null;
        }

        let pages = Math.trunc(json.length / 20);
        if (json.length % 20 > 0) {
            pages++;
        };
        for (let i = 1; i <= pages; i++) {
            let number = createItem("button", divPagination, i);
            pageArray.push(number);
            number.addEventListener("click", function () {
                actionPagination(i, pages);
            });
        };

        next.remove();
        next = createItem("button", divPagination, "Next");
        next.addEventListener("click", function () {
            let pages = Math.trunc(json.length / 20);
            numberPage++;
            updatePagination(pages, numberPage);
            for (let item of visibleRow) {
                item.remove();
            }
            visibleRow = createTable((numberPage - 1) * 20, numberPage * 20, json);
        });
        updatePagination(pages, numberPage);

        for (let item of optionsList) {
            item.remove();
        }
        if (input.value == "") {
            optionsList = createOption(li);
        } else {
            optionsList = createOption(json);
        };
        select.value = filter;
    };

    function createTable(startIndex, endIndex, json) {
        let rowArray = [];
        if (endIndex > json.length) {
            endIndex = json.length;
        }
        for (let i = startIndex; i < endIndex; i++) {
            let item = json[i];
            let row = createRow(item.id, item.firstName, item.lastName, item.email, item.phone, item.adress.state);
            rowArray.push(row);
            row.addEventListener("click", function () {
                if (divAll != null) {
                    divAll.remove();
                    divAll = null;
                }
                divAll = createDetailView(item);
                window.scrollTo(0, 1000);
            });
        }
        return rowArray;
    };
    id.addEventListener("click", function () {
        sortUp("id", id);
    });
    first.addEventListener("click", function () {
        sortUp("firstName", first);
    });
    last.addEventListener("click", function () {
        sortUp("lastName", last);
    });
    email.addEventListener("click", function () {
        sortUp("email", email);
    });
    phone.addEventListener("click", function () {
        sortUp("phone", phone);
    });
    state.addEventListener("click", function () {
        sortUp("state", state);
    });

    function sortUp(name, tag) {
        if (reversName != name) {
            reversName = name
            revers = 1;
        }
        let sortArray = sortList(name, json, numberPage, revers)
        for (let item of visibleRow) {
            item.remove();
        }
        visibleRow = createTable(0, 20, sortArray);
        revers *= -1;
        removeArrow();
        if (revers == -1) {
            tag.className = "up";
        } else {
            tag.className = "down";
        }
    };

    function sortList(propName, list, numberPage, res) {
        let length = list.length;

        let tempArray = [];
        if ((numberPage * 20) < length) {
            length = numberPage * 20;
        };

        for (let i = (numberPage - 1) * 20; i < length; i++) {
            tempArray.push({
                ...list[i].adress,
                ...list[i]
            });
        };
        tempArray.sort(function (a, b) {
            if (a[propName] > b[propName]) {
                return 1 * res;
            }
            if (a[propName] < b[propName]) {
                return -1 * res;
            }
            // a должно быть равным b
            return 0;
        });
        return tempArray;
    };
    let optionsList = createOption(json);

    let previous = createItem("button", divPagination, "Previous");
    previous.setAttribute("disabled", "true");
    previous.addEventListener("click", function () {
        let pages = Math.trunc(json.length / 20);
        numberPage--;
        updatePagination(pages, numberPage);
        for (let item of visibleRow) {
            item.remove();
        }
        visibleRow = createTable((numberPage - 1) * 20, numberPage * 20, json);
        for (let page of pageArray) {
            page.className = "";
        };
        pageArray[numberPage - 1].className = "current";
    });

    function actionPagination(currentNumber, pages) {
        removeArrow();
        for (let item of visibleRow) {
            item.remove();
        }
        visibleRow = createTable((currentNumber - 1) * 20, currentNumber * 20, json);
        numberPage = currentNumber;
        updatePagination(pages, numberPage);
        for (let page of pageArray) {
            page.className = "";
        };
        pageArray[numberPage - 1].className = "current";
    };

    let pages = Math.trunc(json.length / 20);

    if (json.length % 20 > 0) {
        pages++;
    };
    for (let i = 1; i <= pages; i++) {
        let number = createItem("button", divPagination, i);
        pageArray.push(number);
        number.addEventListener("click", function () {
            actionPagination(i, pages);
        });
    };
    pageArray[0].className = "current";

    let next = createItem("button", divPagination, "Next");
    next.addEventListener("click", function () {
        let pages = Math.trunc(json.length / 20);
        numberPage++;
        updatePagination(pages, numberPage);
        for (let item of visibleRow) {
            item.remove();
        }
        visibleRow = createTable((numberPage - 1) * 20, numberPage * 20, json);
        for (let page of pageArray) {
            page.className = "";
        };
        pageArray[numberPage - 1].className = "current";
    });

    function updatePagination(pages, numberPage) {
        removeArrow();
        if (numberPage == 1) {
            previous.setAttribute("disabled", "true")
        } else {
            previous.removeAttribute("disabled")
        }
        if (numberPage == pages) {
            next.setAttribute("disabled", "true")
        } else {
            next.removeAttribute("disabled")
        }
    };

    function removeArrow() {
        id.className = "";
        first.className = "";
        last.className = "";
        email.className = "";
        phone.className = "";
        state.className = "";
    };
};

function createOption(list) {
    let states = ["all"];
    let options = [];
    for (let i = 0; i < list.length; i++) {
        if (!states.includes(list[i].adress.state)) {
            states.push(list[i].adress.state)
        };
    };
    for (let item of states) {
        let option = createItem("option", select, item);
        option.value = item;
        options.push(option);
    };
    return options;
};

function filterList(json, searchText, filter) {
    let arraySearchText = [];
    for (let item of json) {
        if (filter == "all") {
            if (item.firstName.toUpperCase().includes(searchText.toUpperCase())) {
                arraySearchText.push(item);
            };
        } else {
            if ((item.firstName.toUpperCase().includes(searchText.toUpperCase())) && (item.adress.state == filter)) {
                arraySearchText.push(item);
            };
        };

    };
    return arraySearchText;
};

function createDetailView(item) {
    let divAll = createItem("div", divContainer, "");
    divAll.className = "profile";
    let divProfileInfo = createItem("div", divAll, "<span>Profile info:</span>");
    let divName = createItem("div", divAll, `<span>Selected profile:</span> ${item.firstName} ${item.lastName}`);
    let divDescription = createItem("div", divAll, `<span>Description:</span> ${item.description}`);
    let divAddress = createItem("div", divAll, `<span>Address:</span> ${item.adress.streetAddress}`);
    let divCity = createItem("div", divAll, `<span>City:</span> ${item.adress.city}`);
    let divState = createItem("div", divAll, `<span>State:</span> ${item.adress.state}`);
    let divIndex = createItem("div", divAll, `<span>Index:</span> ${item.adress.zip}`);
    return divAll;
}

function createRow(id, firstName, lastName, email, phone, state) {
    let row = createItem("tr", tbody, "");
    let tdId = createItem("td", row, id);
    let tdFirstName = createItem("td", row, firstName);
    let tdLastName = createItem("td", row, lastName);
    let tdEmail = createItem("td", row, email);
    let tdPhone = createItem("td", row, phone);
    let tdState = createItem("td", row, state);
    return row;
}

function createItem(tag, parentItem, text) {
    let temp = document.createElement(tag);
    temp.innerHTML = text;
    parentItem.appendChild(temp);
    return temp;
}

let tbody = document.querySelector("tbody");
let divContainer = document.querySelector(".container");
let select = document.querySelector("select");
let divPagination = document.querySelector(".pagination");
let id = document.querySelector("#id");
let first = document.querySelector("#first");
let last = document.querySelector("#last");
let email = document.querySelector("#email");
let phone = document.querySelector("#phone");
let state = document.querySelector("#state");
let input = document.querySelector("input[type='text']");
