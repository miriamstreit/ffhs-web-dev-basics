const baseUrl = "https://tonyspizzafactory.herokuapp.com/api/";
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4";

function init(title) {
    if (title === "pizzas") {
        makeAjaxCall("pizzas", "GET", true);
    } else if (title === "salads") {
        makeAjaxCall("salads", "GET", true);
    } else if (title === "drinks") {
        makeAjaxCall("softdrinks", "GET", true);
    } else if (title === "cart") {
        getItemsFromLocalStorage();
    }
}

function createArticles(json, urlKey) {
    if (Object.keys(json).length > 0) {
        for (let i in json) {
            if (urlKey === "") {
                json[i] = JSON.parse(json[i]);
            }
            let htmlArticle = document.createElement("article");
            htmlArticle.className = "menu-item";
            htmlArticle.id = i;
            document.getElementById("menu-container").appendChild(htmlArticle);
            let product_image = addElementToParent(htmlArticle, "img", "product-image", null, json[i].imageUrl, json[i].name);
            let menu_details = addElementToParent(htmlArticle, "div", "menu-details-selection-order", "menu-details", null, null);
            let menu_item_description = addElementToParent(menu_details, "div", "menu-item-description", null, null, null);
            let menu_title_and_price = addElementToParent(menu_item_description, "div", "menu-title-and-price", null, null, null);
            let menu_item_title = addElementToParent(menu_title_and_price, "p", "menu-item-title", null, null, null);
            menu_item_title.innerHTML = json[i].name;
            let menu_item_price = addElementToParent(menu_title_and_price, "p", "menu-item-price", null, null, null);
            menu_item_price.innerHTML = json[i].prize;
            let menu_item_contents = addElementToParent(menu_item_description, "p", "menu-item-contents", null, null, null);
            for (let j in json[i].ingredients) {
                menu_item_contents.innerHTML += json[i].ingredients[j];
                if (parseInt(j)+1 < (json[i].ingredients.length)) {
                    menu_item_contents.innerHTML += ", ";
                }
            }
            if (urlKey === "pizzas") {
                // add pizza-specific dropdowns here
            } else if (urlKey === "salads") {
                let select_container = addElementToParent(menu_details, "div", "select-container", null, null, null);
                let select_input = addElementToParent(select_container, "select", "select", "select"+i, null, null);
                let select_input_option1 = addElementToParent(select_input, "option", null, null, null, null);
                select_input_option1.value = "italian";
                select_input_option1.innerHTML = "Italian Dressing";
                let select_input_option2 = addElementToParent(select_input, "option", null, null, null, null);
                select_input_option2.value = "french";
                select_input_option2.innerHTML = "French Dressing";
            } else if (urlKey === "softdrinks") {
                let select_container = addElementToParent(menu_details, "div", "select-container", null, null, null);
                let select_input = addElementToParent(select_container, "select", "select", "select"+i, null, null);
                let select_input_option1 = addElementToParent(select_input, "option", null, null, null, null);
                select_input_option1.value = "33cl";
                select_input_option1.innerHTML = "330ml";
                let select_input_option2 = addElementToParent(select_input, "option", null, null, null, null);
                select_input_option2.value = "50cl";
                select_input_option2.innerHTML = "500ml";
                select_input_option2.selected = true;
                let select_input_option3 = addElementToParent(select_input, "option", null, null, null, null);
                select_input_option3.value = "1.5l";
                select_input_option3.innerHTML = "1500ml";
                menu_item_contents.hidden = true;
            } else if (urlKey === "") {
                if (json[i].flavor != null) {
                    let select_container = addElementToParent(menu_details, "div", "select-container", null, null, null);
                    let select_input = addElementToParent(select_container, "select", "select", "select"+i, null, null);
                    let select_input_option = addElementToParent(select_input, "option", null, null, null, null);
                    select_input_option.value = JSON.stringify(json[i].flavor);
                    select_input_option.innerHTML = JSON.stringify(json[i].flavor);
                    select_input.disabled = true;
                } else {
                    let select_container = addElementToParent(menu_details, "div", "select-container", null, null, null);
                }
            } else {
                console.error("I don't know how you got here...");
            }
            let amount_label = addElementToParent(menu_details, "label", "amount-label", null, null, null);
            amount_label.for = "amount";
            amount_label.innerHTML = "Amount";
            let amount_input = addElementToParent(menu_details, "input", "amount-input", "amount", null, null);
            amount_input.type = "number";
            amount_input.step = "1";
            amount_input.value = "1";
            amount_input.min = "1";
            amount_input.required = true;
            let menu_item_addtocart = addElementToParent(menu_details, "div", "menu-item-addtocart", null, null, null);
            menu_item_addtocart.onclick = function () {
                if (urlKey !== "") {
                    let item = json[i];
                    if (urlKey === "salads") {
                        item.type = "salad";
                        item.flavor = document.getElementById("select"+i).options[document.getElementById("select"+i).selectedIndex].value;
                    } else if (urlKey === "softdrinks") {
                        item.type = "softdrink";
                        item.flavor = document.getElementById("select"+i).options[document.getElementById("select"+i).selectedIndex].value;
                        //item.volume = document.getElementById("select").selectedOptions;
                    } else if (urlKey === "pizzas") {
                        item.type = "pizza";
                    }
                    localStorage.setItem(parseInt(Object.keys(localStorage).length), JSON.stringify(item));
                } else {
                    localStorage.removeItem(i);
                    document.getElementById(i).remove();
                }
            };
            if (urlKey === "") {
                let cart_button_image = addElementToParent(menu_item_addtocart, "img", "cart-button-image", null, "../img/trash.png", "remove from cart");
            } else {
                let cart_button_image = addElementToParent(menu_item_addtocart, "img", "cart-button-image", null, "../img/cart.png", "add to cart");
            }
        }
    } else {
        document.getElementById("menu-container").innerHTML = "<h2>Nothing to display... Not hungry yet?</h2>";
    }
}

function getItemsFromLocalStorage() {
    // create and return a json object and then call createArticles(json, urlKey)
    let json = Object.assign({}, localStorage);
    createArticles(json, "");
}

function addElementToParent(parent, element, cssClass, id, src, altText) {
    let htmlObject = document.createElement(element);
    if (cssClass !== null) {
        htmlObject.className = cssClass;
    }
    if (id !== null) {
        htmlObject.id = id;
    }
    if (element === "img".toLowerCase() && src !== null && altText !== null) {
        htmlObject.src = src;
        htmlObject.alt = altText;
    }
    parent.appendChild(htmlObject);
    return htmlObject;
}

function makeAjaxCall (urlKey, methodType, callback) {
    let xhr = new XMLHttpRequest();
    let json = {};
    let url = baseUrl + urlKey;
    xhr.open(methodType, url, callback);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.info("xhr done successfully");
                json = JSON.parse(xhr.response);
                createArticles(json, urlKey);
            } else {
                document.getElementById("menu-container").innerHTML = "<h2>There was an issue handing the menu to you, please try again later. We're sorry!</h2>";
                console.error("xhr failed");
            }
        } else {
            console.info("xhr still processing");
        }
    }
    xhr.setRequestHeader("Authorization", token);
    xhr.send();
    console.info("request sent successfully");
}

function postOrder() {
    let url = baseUrl + "orders";
    let orderItems = Object.assign({}, localStorage);
    for (let i in orderItems) {
        orderItems[i] = JSON.parse(orderItems[i])
        let postJson = {};
        // no real use of id since API doesn't auto-increment anyway
        //postJson.id = orderItems[i].id;
        postJson.type = orderItems[i].type;
        postJson.name = orderItems[i].name;
        let options = {
            method: "POST",
            body: JSON.stringify(postJson),
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "Authorization": token
            }
        }
        fetch(url, options).then(response => {
            if (response.ok) {
                // order success
                localStorage.removeItem(i);
                document.getElementById(i).remove();
                if (parseInt(Object.keys(localStorage).length) === 0) {
                    document.getElementById("menu-container").innerHTML = "<h2>Thank you for your order!</h2>";
                }
            } else {
                document.getElementById("menu-container").innerHTML += "<h2>There was an error handing your order to the chef... We're sorry.</h2>";
            }
        }).catch(error => console.error("Error: " + error));
    }
}