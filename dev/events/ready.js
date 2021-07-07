const { createEvent } = require('../../dist/index');

module.exports = createEvent('ready', {
    once: true,

    run: () => {
        console.log('Online');
    },
});
