module.exports = function (app) {
    app.use("/image", require("./image"));
    app.use("/buyer", require("./buyer"));
    app.use("/shop", require("./shop"));
    app.use("/category", require("./category"));
    app.use("/env", (req, res) => {
        console.table(process.env)
        res.json(process.env);
    });
    app.use("/", (req, res) => {
        res.status(404).json({"message": "Default Route"})
    });
};