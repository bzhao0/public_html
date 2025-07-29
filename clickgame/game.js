let widget_container = document.getElementById("widget-container");
let score_element = document.getElementById("score");
let stores = document.getElementsByClassName("store");

let score = 0;
let super_gompei_count = 0;
const baseCosts = new Map();

function initializeStoreCosts() {
    for (const store of stores) {
        const name = store.getAttribute("name");
        const cost = parseInt(store.getAttribute("cost"));
        if (name) {
            baseCosts.set(name, cost);
        }
    }
}

function changeScore(amount) {
    score += amount;
    score_element.innerHTML = "Score: " + score.toFixed(2);

    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if (cost > score) {
            store.setAttribute("broke", "");
        }
        else {
            store.removeAttribute("broke");
        }
    }
    // toFixed(2) round to 2 decimal places next time
}

function createWidgetFromStore(store) {
    let new_widget = store.firstElementChild.cloneNode(true);

    new_widget.onclick = () => {
        harvest(new_widget)
    }

    widget_container.appendChild(new_widget);

    if (new_widget.getAttribute("auto") == "true") {
        new_widget.setAttribute("harvesting", "");
        setup_end_harvest(new_widget);
    }
}

function buy(store) {
    let cost = parseInt(store.getAttribute("cost"));

    if (cost > score) {
        return;
    }

    changeScore(-cost);

    const newCost = Math.ceil(cost * 1.15);
    store.setAttribute("cost", newCost);

    for (const child of store.children) {
        if (child.innerHTML.includes("Cost:")) {
            child.innerHTML = "Cost: " + newCost;
            break;
        }
    }

    const storeName = store.getAttribute("name");

    if (storeName == "Hyper-Gompei") {
        rebirth();
        createWidgetFromStore(store);

        return;
    }

    let super_gompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
    if (storeName == "Super-Gompei" && super_gompei != null) {
        let old_reap = parseInt(super_gompei.getAttribute("reap"));
        super_gompei.setAttribute("reap", old_reap + 100);
        super_gompei_count++;
        document.body.style = "--gompei-count:" + super_gompei_count;
        return;
    }
    createWidgetFromStore(store);
}

function setup_end_harvest(widget) {
    setTimeout(() => {
        // If widget is no longer in the document (e.g., after a rebirth),
        // stop its harvest cycle.
        if (!widget.isConnected) {
            return;
        }

        widget.removeAttribute("harvesting");

        if (widget.getAttribute("auto") == "true") {
            harvest(widget);
        }


    }, parseFloat(widget.getAttribute("cooldown")) * 1000);

}

function harvest(widget) {
    if (widget.hasAttribute("harvesting")) {
        return;
    }

    widget.setAttribute("harvesting", "");

    changeScore(parseFloat(widget.getAttribute("reap")));
    givePoints(widget);

    setup_end_harvest(widget);


}

function givePoints(widget) {
    let points_element = document.createElement("span");
    points_element.className = "point";
    points_element.innerHTML = "+" + widget.getAttribute("reap");
    points_element.onanimationend = () => {
        points_element.remove();
    }
    widget.appendChild(points_element);

    if (widget.getAttribute("name") === "Lawn") {
        const old_reap = parseFloat(widget.getAttribute("reap"));
        const new_reap = (old_reap * 1.01).toFixed(2);
        widget.setAttribute("reap", new_reap);
    }
}

function rebirth() {
    const widgetsToRemove = [];
    const removableNames = ["lawn", "gompei", "super-gompei"];

    for (const widget of widget_container.children) {
        // Using toLowerCase for case-insensitive matching.
        const name = widget.getAttribute("name")?.toLowerCase();
        if (removableNames.includes(name)) {
            widgetsToRemove.push(widget);
        }
    }

    for (const widget of widgetsToRemove) {
        widget.remove();
    }

    // Reset store costs to their base values
    for (const store of stores) {
        const name = store.getAttribute("name");
        if (baseCosts.has(name)) {
            const baseCost = baseCosts.get(name);
            store.setAttribute("cost", baseCost);

            // Update the displayed cost text, matching the logic in the buy() function
            for (const child of store.children) {
                if (child.innerHTML.includes("Cost:")) {
                    child.innerHTML = "Cost: " + baseCost;
                    break;
                }
            }
        }
    }

    super_gompei_count = 0;
    document.body.style = "--gompei-count:" + super_gompei_count;

    changeScore(-score + 5);
}

let harvestingIntervalId = null;
let currentWidget = null;

function startHarvesting(widget) {
    if (harvestingIntervalId) {
        return; // Already harvesting
    }

    currentWidget = widget;

    harvestingIntervalId = setInterval(() => {
        harvest(widget);
    }, 50); // Adjust the interval (100ms) as needed
}

function stopHarvesting() {
    if (harvestingIntervalId) {
        clearInterval(harvestingIntervalId);
        harvestingIntervalId = null;
        currentWidget = null;
    }
}

widget_container.addEventListener("mousedown", (event) => {
    if (event.target.getAttribute("name") === "Lawn") {
        startHarvesting(event.target);
    }
});

widget_container.addEventListener("mouseup", stopHarvesting);
widget_container.addEventListener("mouseleave", stopHarvesting);


changeScore(5);
initializeStoreCosts();
