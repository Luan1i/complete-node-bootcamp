// SYNC WAY

const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate')

///////////////////// FILES
// const textIn = fs.readFileSync('./1-node-farm/starter/txt/input.txt','utf-8');
// console.log(textIn);
//
// const textOut = `AVOCADOOOOOOOOOOOOOOOOOOOO: ${textIn} .\n Created on date: ${Date.now()}`;
// fs.writeFileSync('./1-node-farm/starter/txt/output.txt', textOut)
// console.log('File Written!');


// ASYNC

// fs.readFile('./1-node-farm/starter/txt/start.txt','utf-8',(err,data1) => {
//     if(err) return  console.log('ERROR!');
//
//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`, 'utf-8', (err , data2) => {
//         console.log(data2);
//
//         fs.readFile('./1-node-farm/starter/txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//
//             fs.writeFile('./1-node-farm/starter/txt/final.txt', `${data2} \n ${data3}`, 'utf-8',err => {
//                 console.log('U SHKRU');
//             })
//         })
//     })
// })

////////////////////////////
//Server

const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);

    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    } else {
        res.writeHead(400, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('Page not found!');
    }

    // res.end('Hello from server');
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listen from server port 8000');
})

