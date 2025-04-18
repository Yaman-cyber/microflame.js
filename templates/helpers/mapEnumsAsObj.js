/**
 * @param {module} enums An enum module from the /enums directory
 * @returns {Array} A list of enum module values as object of {name, value}
 */

module.exports = function (enums) {
  return Object.keys(enums).map((key) => ({
    name: key
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" "),
    value: enums[key],
  }));
};
