module.exports = function (app) {
    app.use("/image", require("./image2"));
    app.use("/buyer", require("./buyer"));
    app.use("/shop", require("./shop"));
    app.use("/category", require("./category"));
    app.use("/monitoring",require("./monitoring"));
    app.use("/", (req, res) => {
        res.status(404).json({"message": "Default Route"})
    });
};