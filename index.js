const express = require('express');
const fs = require('node:fs');

const app = express();
app.use(express.json());

const myMiddleware = (req, res, next) => {
    // console.log("request received at URL" , req.url , "at" , new Date())
    fs.appendFileSync(
        "accessLog.txt",
        // {encoding : "utf-8"},
        `\nRequest recieved at ${req.url} at the time of ${new Date()}`
    )
    next();
}

const middleWareApiKey = (req, res, next) => {
    console.log(req.params)
    if (req.params.apiKey === "123-456-243") {
        // res.status(200).json({
        //     success: true,
        //     message: "Api key is right"
        // })
        next();
    } else {
        res.status(400).json({
            success : false,
            message : "Api key is wrong"
        })
    }
}


app.use(myMiddleware);
app.use("/api/v1/get-products/:productId/:apiKey",middleWareApiKey);

const products = [
    {
        productId: 1,
        name: 'phone'
    },
    {
        productId: 2,
        name: 'tshirt'
    },
    {
        productId: 3,
        name: 'charger'
    }
]

app.get('/api/v1/get-products/:productId/:apiKey', (req, res) => {
    console.log(req.params);
    const product = products.find(
        (product) => product.productId == req.params.productId
    )

    if (product) {
        res.json({
            success: true,
            data: product
        })
    } else {
        res.status(404).json({
            success: false,
            message: "there is no product with productID " + req.query.productId,
        })
    }

    // res.json({
    //     success : true,
    //     message : "get products api",
    //     data : products
    // })
    console.log(req.query);
    console.log("Request received on Get Users end point");
})

app.listen(8080, () => {
    console.log("express server is up and running on port 8080")
})