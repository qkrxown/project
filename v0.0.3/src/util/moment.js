const moment = require("moment");

 function test(date){

        const dateClass = new Date(date);
        const year = dateClass.getFullYear();
            const weekNum = moment(dateClass).week();

            console.log(day);
        }
test("2023-07-05");