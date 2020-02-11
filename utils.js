const filterInstrumentsByName = (instruments, name) =>
  instruments.filter(instrument =>
    instrument.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
  );

module.exports = {
  filterInstrumentsByName
};
