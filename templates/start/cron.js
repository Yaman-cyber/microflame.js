const exampleCronHandler = require("../crons/example.cron");

module.exports = function (schedule) {
  //At 12am and 12pm
  schedule.scheduleJob("0 0,12 * * *", async function () {
    //exampleCronHandler.exampleTask();
  });

  //Thursday and friday
  schedule.scheduleJob("0 0 * 4,5", () => {
    //exampleCronHandler.exampleTask();
  });

  //Once a day
  schedule.scheduleJob("0 0 * * *", () => {
    //exampleCronHandler.exampleTask();
  });

  //Every min
  schedule.scheduleJob("* * * * *", () => {
    //exampleCronHandler.exampleTask();
  });
};
