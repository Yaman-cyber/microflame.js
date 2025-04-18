/**
 * @param {module} enums An enum module from the /enums directory
 * @returns {Array} A list of enum module values
 */

module.exports = function (enums) {
  return Object.keys(enums).map((key) => enums[key]);
};
