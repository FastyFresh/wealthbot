const polyfills = {
  initPolyfills: () => {
    // Add any required polyfills here
    if (!Object.hasOwn) {
      Object.defineProperty(Object, 'hasOwn', {
        value: function (object: object, property: PropertyKey) {
          if (object == null) {
            throw new TypeError('Cannot convert undefined or null to object');
          }
          return Object.prototype.hasOwnProperty.call(Object(object), property);
        },
        configurable: true,
        writable: true,
      });
    }

    // Add more polyfills as needed
  }
};

export default polyfills;
