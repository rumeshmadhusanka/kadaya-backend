module.exports = function (app) {
    app.use("/shop", require("./shop"));
    app.use("/category", require("./category"));
    app.use("/", (req, res) => {
        res.status(404).json({"message": "Default Route"})
    });
};