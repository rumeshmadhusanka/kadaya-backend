const jwt = require('jsonwebtoken');
const pg_pool = require("./db");
const config = {
    "secret": process.env.JWT_SECRET,
};

module.exports = {

    verifyToken: async (req, res, next) => {

        let token = req.headers['x-access-token'];
        if (!token) {
            console.log("Token not found");
            return res.status(403).json({"message":"Login to proceed. No token found"});
        }

        jwt.verify(token, config.secret, (error, decoded) => {
            if (error) {
                console.log("Token corrupted");
                return res.status(403).json({"message":"Token Corrupted"});
            }
            if (typeof (decoded.buyer_id) !== 'undefined') {
                req.buyer_id = decoded.buyer_id;
                req.user_type = 'BUYER';
            } else if (typeof (decoded.shop_id) !== 'undefined') {
                req.shop_id = decoded.shop_id;
                req.user_type = 'SHOP';
            }
            next()
        })
    },

    isShop: async (req, res, next) => {
        if (req.user_type === 'SHOP') {
            next()
        } else {
            console.log("Not authorized");
            return res.status(401).json({"message":"Access not authorized"});
        }
    },

    isBuyer: (req, res, next) => {
        if (req.user_type === 'BUYER') {
            next()
        } else {
            console.log("Not authorized");
            return res.status(401).json({"message":"Access not authorized"});
        }
    },

    isSameBuyer: async (req, res, next) => {
        if (req.buyer_id === req.params.buyer_id || req.buyer_id === req.query.buyer_id || req.buyer_id === req.body.buyer_id) {
            next()
        } else {
            console.log("Not authorized");
            return res.status(401).json({"message":"Access not authorized"});
        }
    },

    isSameShop: async (req, res, next) => {
        if (req.shop_id === req.params.shop_id || req.shop_id === req.query.shop_id || req.shop_id === req.body.shop_id) {
            next()
        } else {
            console.log("Not authorized");
            return res.status(401).json({"message":"Access not authorized"});
        }
    },

    isSameShopOrBuyer: async (req, res, next) => {
        if (req.shop_id === req.params.shop_id || req.shop_id === req.query.shop_id || req.shop_id === req.body.shop_id || req.buyer_id === req.params.buyer_id || req.buyer_id === req.query.buyer_id || req.buyer_id === req.body.buyer_id) {
            next()
        } else {
            console.log("Not authorized");
            return res.status(401).json({"message":"Access not authorized"});
        }
    },

};