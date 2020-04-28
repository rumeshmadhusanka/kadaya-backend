module.exports = function (app) {
    app.use("/image", require("./image"));
    app.use("/item", require("./item"));
    app.use("/buyer", require("./buyer"));
    app.use("/shop", require("./shop"));
    app.use("/category", require("./category"));
    app.use("/monitoring",require("./monitoring"));
    app.use("/order",require("./order"));
    app.use("/expo",require("./expo"));
    app.use("/", (req, res) => {
        res.status(404).json({"message": "Default Route"})
    });
};