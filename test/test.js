const getters = require('../src/getInfo');
(async () =>
{
    let patient = await getters.getVaccinByPatient(1);
    console.log(patient);
})();