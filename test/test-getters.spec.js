/**
 * Test the application with mocha
 */

const getters = require('../src/getInfo');

describe("Test the getters", function ()
{
    it("Should return patient 'Test User' with 3 vaccins", async function (done)
    {
        let patient = await getters.getVaccinByPatient(1);
        console.log(patient);
        if(patient.length === 2)
        {
            done();
        } else
        {
            done(new Error("The patient doesn't have 3 vaccins"));
        }
    });
});