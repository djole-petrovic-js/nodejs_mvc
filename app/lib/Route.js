class Route {
  constructor(config) {
    this.route = config.route;
    this.method = config.method;
    this.controller = config.controller;
  }

  name(name) {
    this.name = name;
  }
}

module.exports = Route;