const os = require('os');
const router = require("express").Router();


router.get("/env", (req, res) => {
    console.table(process.env);
    res.json(process.env);
});

String.prototype.toHHMMSS = function () {
    const sec_num = parseInt(this, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
};

router.get('/health', async function (req, res, next) {
    try {
        let time = process.uptime();
        const uptime = (time + "").toHHMMSS();
        let d = {
            "cpu": os.cpus()[0].speed,
            "uptime": uptime,
            "free mem": os.freemem() / (1024 * 1024),
            "total mem": os.totalmem() / (1024 * 1024),
            "load avg": os.loadavg()[0],

        };

        await res.json(d);
    } catch (e) {
        console.log(e);
        res.status(502).send();
    }

});

module.exports = router;