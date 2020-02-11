function initialseApp() {
  const pastSearch = {};

  // Create li node by given parameters
  // ('a', 'b', 'c') => <li class="instrument" key="b" data-symbol="c">a</li>
  const createInstumentElement = (text, key, symbol) => {
    const elem = document.createElement("li");
    elem.className = "instrument";
    elem.textContent = text;
    elem.setAttribute("key", key);
    elem.setAttribute("data-symbol", symbol);
    return elem;
  };

  // Remove all child by given node
  const deleteAllChilds = parentNode => {
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild);
    }
  };

  // Update answers div by given array of instruments
  const updateSearchAnswers = (instruments = [], emptySearch = false) => {
    // Get answers node
    const answers = document.querySelector(".search__answers");

    // Delete all his childs
    deleteAllChilds(answers);

    // Create node foreach instrument and append it to answers node
    instruments.forEach(instrument => {
      const { name, instrumentId, symbol } = instrument;
      const elem = createInstumentElement(name, instrumentId, symbol);
      answers.appendChild(elem);
    });

    // If there is no instruments and the user searched for something (emprySarch) => Let him know that we did find anything...
    if (instruments.length === 0 && !emptySearch) {
      const elem = document.createElement("li");
      elem.textContent = "We didn't find anything...";
      elem.className = "warning";
      answers.appendChild(elem);
    }
  };

  // Update portfolio div by given array of instruments
  const updatePortfolio = portfolio => {
    // Get portfolio node
    const portfolioList = document.getElementById("portfolio__list");

    // Delete all his childs
    deleteAllChilds(portfolioList);

    // Create node foreach instrument and append it to portfolio
    portfolio.forEach(instrument => {
      const { name, instrumentId, symbol } = instrument;
      const elem = createInstumentElement(name, instrumentId, symbol);

      portfolioList.appendChild(elem);
    });
  };

  // Listen for input from the user,
  // And update the list when he typing...
  document.getElementById("seach-input").addEventListener("input", e => {
    const { value: name } = e.target;

    // Check if the search field in not empty
    if (name !== "") {
      // Check if the user dont search for that term before,
      // if he search for it, return to him the available data
      // and avoid from another request to the server
      if (!pastSearch[name]) {
        fetch(`http://127.0.0.1:3000/instruments?name=${name}`).then(data => {
          data.json().then(response => {
            pastSearch[name] = response;
            updateSearchAnswers(pastSearch[name]);
          });
        });
      } else {
        updateSearchAnswers(pastSearch[name]);
      }
    } else {
      updateSearchAnswers([], true);
    }
  });

  // Listen to click on one of the instruments that found,
  // ask from the server to add this instrument the portfolio
  // and then update the UI.
  document.querySelector(".search__answers").addEventListener("click", e => {
    if (e.target.className === "instrument") {
      const id = e.target.getAttribute("key");
      fetch(`http://127.0.0.1:3000/instruments?id=${id}`, {
        method: "POST"
      }).then(response => {
        switch (response.status) {
          case 201:
            document
              .getElementById("portfolio__list")
              .appendChild(e.target.cloneNode(true));
            break;
          case 200:
            alert("Already added :)");
            break;
        }
      });
    }
  });

  // Listen to click on the portfolio items.
  // When the user clicked on item
  // ask from the server to delete this item
  // and remove it from the UI.
  document.getElementById("portfolio__list").addEventListener("click", e => {
    if (e.target.className === "instrument") {
      const id = e.target.getAttribute("key");
      fetch(`http://127.0.0.1:3000/portfolio?id=${id}`, {
        method: "DELETE"
      }).then(response => {
        switch (response.status) {
          case 204:
            e.target.remove();
            break;
          case 500:
            alert("Something goes wrong ... :/");
        }
      });
    }
  });

  // When the document loaded, update the portfolio
  fetch(`http://127.0.0.1:3000/portfolio`).then(data => {
    data.json().then(response => {
      updatePortfolio(response);
    });
  });
}

// When the document loaded, initialize the app
window.addEventListener("DOMContentLoaded", () => {
  initialseApp();
});
