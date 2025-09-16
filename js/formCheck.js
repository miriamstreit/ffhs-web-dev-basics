const baseUrl = "https://tonyspizzafactory.herokuapp.com/api/";
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4";

function validateForm() {
    let isFormValid = true;
    document.getElementById(event.target.id).reportValidity();
    if (!isRadioGroupValid("pizzaFeedback")) {
        document.getElementById("pizza-feedback-error").innerText = "Please select how good our pizza is";
        isFormValid = false;
    } else document.getElementById("pizza-feedback-error").innerText = "";
    if (!isRadioGroupValid("priceFeedback")) {
        document.getElementById("price-feedback-error").innerText = "Please select what you think about our prices";
        isFormValid = false;
    } else document.getElementById("price-feedback-error").innerText = "";
    if (!isTextFieldValid("name")) {
        document.getElementById("name-error").innerText = "Please fill out your name";
        isFormValid = false;
    } else document.getElementById("name-error").innerText = "";
    if (!isEmailFieldValid("email")) {
        document.getElementById("email-error").innerText = "Please fill out a valid email-address";
        isFormValid = false;
    } else document.getElementById("email-error").innerText = "";
    if (!isTextAreaValid("improvements")) {
        document.getElementById("improvements-error").innerText = "Please write something you'd like to tell us (min. 50 characters)";
        isFormValid = false;
    } else document.getElementById("improvements-error").innerText = "";
    if (isFormValid) {
        document.getElementById("feedback-button").disabled = false;
    }

}

function submitFeedback() {
    if (document.getElementById("feedback-form").checkValidity() === false) return false;
    event.preventDefault();

    const feedback = {};
    feedback.id = 0;
    feedback.pizzaRating = document.querySelector('input[name="pizzaFeedback"]:checked').value;
    feedback.prizeRating = document.querySelector('input[name="priceFeedback"]:checked').value;
    feedback.name = document.querySelector('input[id = "name"]').value;
    feedback.email = document.querySelector('input[id = "email"]').value;
    feedback.feedback = document.querySelector('textarea[id = "improvements"]').value;

    postFeedback(feedback, () => getAllFeedbacks(),
        () => {
        document.getElementById("general-error").innerText = "Your feedback could not be forwarded to the boss! Try again later.";
    });
}

function isRadioGroupValid(groupName) {
    let isValid = false;
    let radioButtons = document.getElementsByName(groupName);
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            isValid = true;
        }
    }
    return isValid;
}

function isTextFieldValid(elementId) {
    return document.getElementById(elementId).value !== "";
}

function isEmailFieldValid(elementId) {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    const email = document.getElementById(elementId).value;
    return email && emailRegex.test(email);

}

function isTextAreaValid(elementId) {
    const value = document.getElementById(elementId).value
    return value && value.length >= 50;
}

function postFeedback(feedback, callbackSuccess, callbackError) {
    let url = baseUrl + "feedback";
    let options = {
        method: "POST",
        body: JSON.stringify(feedback),
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "Authorization": token
        }
    };

    fetch(url, options).then(response => {
        if (response.ok) {
            callbackSuccess();
        } else {
            callbackError();
        }
    }).catch(error => {
        callbackError();
        console.error("Error: " + error)
    });
}

function getAllFeedbacks() {
    let url = baseUrl + "feedback";
    let options = {
        method: "GET",
        mode: "cors",
        headers: {
            "Authorization": token
        }
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => renderCharts(data))
        .catch(error => {
            window.location.href = "../html/index.html";
            console.error("Error: " + error)
        });
}

function renderCharts(data) {
    document.getElementById("page-title").innerText = "What did others think?";
    const element = document.getElementById("feedback-form");
    const parentElement = element.parentNode;
    parentElement.removeChild(element);
    parentElement.classList.remove("section-feedback");
    parentElement.classList.add("section-charts");

    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    parentElement.appendChild(chartContainer);

    const pizzaChartContainer = document.createElement("div");
    pizzaChartContainer.id = "pizza-chart";
    pizzaChartContainer.className = "pie-chart";
    chartContainer.appendChild(pizzaChartContainer);

    const priceChartContainer = document.createElement("div");
    priceChartContainer.id = "price-chart";
    priceChartContainer.className = "pie-chart";
    chartContainer.appendChild(priceChartContainer);

    const homeButton = document.createElement("button");
    homeButton.href = "index.html";
    homeButton.innerText = "Back to home";
    homeButton.className = "button";
    homeButton.onclick = () => window.location.href = "../html/index.html";
    parentElement.appendChild(homeButton)

    const pizzaRatings = [
        { rating: "poor", amount: data.filter((obj) => obj.pizzaRating === "poor").length},
        { rating: "okay", amount: data.filter((obj) => obj.pizzaRating === "okay").length},
        { rating: "good", amount: data.filter((obj) => obj.pizzaRating === "good").length},
        { rating: "awesome", amount: data.filter((obj) => obj.pizzaRating === "awesome").length}
    ];
    const priceRatings = [
        { rating: "fair", amount: data.filter((obj) => obj.prizeRating === "fair").length},
        { rating: "okay", amount: data.filter((obj) => obj.prizeRating === "okay").length},
        { rating: "expensive", amount: data.filter((obj) => obj.prizeRating === "expensive").length}
    ];

    const pizzaSvg = dimple.newSvg("#pizza-chart", 590, 400);
    pizzaSvg.append("text")
        .attr("x", 70)
        .attr("y", 20)
        .style("text-anchor", "middle")
        .style("font-family", "Roboto Slab Regular")
        .style("font-weight", "bold")
        .text("All pizza ratings");
    const pizzaChart = new dimple.chart(pizzaSvg, pizzaRatings);
    setUpChart(pizzaChart);

    const priceSvg = dimple.newSvg("#price-chart", 590, 400);
    priceSvg.append("text")
        .attr("x", 70)
        .attr("y", 20)
        .style("text-anchor", "middle")
        .style("font-family", "Roboto Slab Regular")
        .style("font-weight", "bold")
        .text("All price ratings");
    const priceChart = new dimple.chart(priceSvg, priceRatings);
    setUpChart(priceChart);
}

function setUpChart(chart) {
    chart.setBounds(20, 20, 460, 360)
    chart.addMeasureAxis("p", "amount");
    chart.addSeries("rating", dimple.plot.pie);
    chart.addLegend(500, 20, 90, 300, "left");
    chart.draw();
}
