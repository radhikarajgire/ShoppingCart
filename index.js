
//Node modules that are required by the package to run the request

const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require ('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////////////////////FILES

//Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `this is text we wrote about avo ${textIn} \n created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File added');

//Non Blocking , Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//      console.log(data2);
//      fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//         console.log(data3);
//         fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8' , err => {
//               console.log('Your file has been written');
//         });
// });
// });
// });
// console.log('Will read file!');
///////////////////////////////////////////SERVER

  
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` ,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html` ,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html` ,'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json` ,'utf-8');
    const dataObj = JSON.parse(data);

    const slugs = dataObj.map(el => slugify(el.productName, { lower:true }));
    console.log(slugs);


    const server = http.createServer((req, res) => {
    const {query, pathname}  = url.parse(req.url, true);

    //overview page
    if(pathname==='/' || pathname==='/overview'){
    res.writeHead(200, {'Content-type': 'text/html'});

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);


        //product
    } else if(pathname === '/product') {
      
        res.writeHead(200, {'Content-type': 'text/html'});
      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct, product);
          res.end(output);

        //API
    } else if(pathName === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

        //NOT found
    } else {
        res.writeHead(404, {
            'Content-type':'text/html',
            'my-own-header':'Hello world'
        });
        res.end('<h1>page not found</h1>');
    }
   
});
server.listen(8000, '127.0.0.1' , () => {
    console.log('listening to request on port 8000');
})