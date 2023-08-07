const express = require('express');

const { connection } =require('./config/db') ;
const {ProductModel} = require ('./models/ProductModel')

const app  = express();
app.use(express.json());

app.get('/', async (req, res) => {
    const filters = {};
    const {category,sort,search,paginate} = req.query;
    if(category) {
        filters.category = category
    }
    const toSort = sort==='asc'?'postedAt':'-postedAt'
    const regex = new RegExp(search, 'i');
    filters.name = regex;
    const pageNo = parseInt(paginate) || 1;
    const limit = 4;
    const skip = (pageNo-1)*limit;

    const classifieds = await ProductModel.find(filters).sort(toSort).skip(skip).limit(limit)
    res.json({"classifieds":classifieds});
});



app.post('/post', async (req, res)=>{
    const product = req.body;
    const prodToSave = new ProductModel(product);
   try {
    await prodToSave.save();
    res.send('product added');
   }
   catch (err) {
    res.status(500).json('couldnt add product',err)
   }
})

app.post('/edit/:id', async (req, res)=>{
    const product = req.body;
    const id = req.params.id;
    try {
        const prodToEdit = await ProductModel.findByIdAndUpdate(id,product);
        res.status(200).json('product updated')
    }
    catch (err) {
        res.status(500).json('couldn edit product',err)
    }  
})

app.post('/delete/:id', async (req, res)=>{
    const id = req.params.id;
    try {
        await ProductModel.findByIdAndDelete(id);
        res.status(200).json('product deleted')
    }
    catch (err) {
        res.status(500).json('couldnt delete product due to',err)
    }  
})




app.listen(8080, async()=>{
    try {
        await connection 
        console.log('connected to db')
    }
    catch(err) {
        console.log('error connecting to db')
    }
    console.log("active port 8080");
})