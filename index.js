var express = require("express");
var app = express();
const { filterInstrumentsByName } = require("./utils");

// All instrument data
const instruments = [
  {
    instrumentId: 1,
    name: "Euro US Dollar",
    symbol: "EUR/USD",
    instrumentType: "currency"
  },
  {
    instrumentId: 10,
    name: "Euro Swiss Franc",
    symbol: "EUR/CHF",
    instrumentType: "currency"
  },
  {
    instrumentId: 9,
    name: "Euro Japanese Yen",
    symbol: "EUR/JPY",
    instrumentType: "currency"
  },
  {
    instrumentId: 956731,
    name: "Investing.com Euro Index",
    symbol: "inveur",
    instrumentType: "indice"
  },
  {
    instrumentId: 2124,
    name: "US Dollar Euro",
    symbol: "USD/EUR",
    instrumentType: "currency"
  },
  {
    instrumentId: 976573,
    name: "Sygnia Itrix Euro Stoxx 50 ETF",
    symbol: "SYGEUJ",
    instrumentType: "etf"
  },
  {
    instrumentId: 997393,
    name: "NewWave EUR Currency Exchange Traded Note",
    symbol: "NEWEURJ",
    instrumentType: "etf"
  },
  {
    instrumentId: 998227,
    name: "Diesel European Gasoil Futures",
    symbol: "DSEL1c1",
    instrumentType: "commodity"
  },
  {
    instrumentId: 175,
    name: "Euro Stoxx 50",
    symbol: "STOXX50",
    instrumentType: "indice"
  },
  {
    instrumentId: 15978,
    name: "Euronet Worldwide Inc",
    symbol: "EEFT",
    instrumentType: "equities"
  },
  {
    instrumentId: 6,
    name: "Euro British Pound",
    symbol: "EUR/GBP",
    instrumentType: "currency"
  },
  {
    instrumentId: 15,
    name: "Euro Australian Dollar",
    symbol: "EUR/AUD",
    instrumentType: "currency"
  },
  {
    instrumentId: 16,
    name: "Euro Canadian Dollar",
    symbol: "EUR/CAD",
    instrumentType: "currency"
  },
  {
    instrumentId: 52,
    name: "Euro New Zealand Dollar",
    symbol: "EUR/NZD",
    instrumentType: "currency"
  },
  {
    instrumentId: 1487,
    name: "Australian Dollar Euro",
    symbol: "AUD/EUR",
    instrumentType: "currency"
  },
  {
    instrumentId: 1525,
    name: "Canadian Dollar Euro",
    symbol: "CAD/EUR",
    instrumentType: "currency"
  }
];

// Initialize with empty portfolio
const portfolio = [];

// find instruments by given name and send them back to the user
app.get("/instruments", function(req, res) {
  const { name } = req.query;

  // Ensure that the serach is not an empty string
  if (name !== "") {
    const data = filterInstrumentsByName(instruments, name);
    res.send(data);
  } else {
    res.status(400).send("You must provide instrument name");
  }
});

// Listen when the user what his portfolio and send it to him.
app.get("/portfolio", (req, res) => {
  res.send(portfolio);
});

// When the user ask to delete instrument from the portfolio:
// Ensure that the id is a number
app.delete("/portfolio", (req, res) => {
  id = parseInt(req.query.id);
  if (id !== NaN) {
    const index = portfolio.findIndex(
      instument => instument.instrumentId === id
    );
    if (index !== -1) {
      portfolio.splice(index, 1);
      res.status(204).send("Instrument deleted :)");
    } else {
      res.status(404).send("Instrument not found!");
    }
  } else {
    res.status(400).send("Insert avlid id!");
  }
});

app.post("/instruments", function(req, res) {
  const id = parseInt(req.query.id);
  const instrumentToAdd = instruments.find(
    instrument => instrument.instrumentId === id
  );
  if (instrumentToAdd) {
    const exist = portfolio.find(instrument => instrument.instrumentId === id);
    if (exist) {
      res.status(200).send("Already exist...");
    } else {
      portfolio.push(instrumentToAdd);
      res.status(201).send("Added!");
    }
  } else {
    res.status(400).send("not found...");
  }
});

// Server static files
app.use(express.static(__dirname + "/public"));

// Listen for request on port 3000
app.listen(3000);
