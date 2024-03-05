import express from 'express';
import mongoose from 'mongoose';
import ejs from 'ejs';
import bodyParser from 'body-parser';
// import Category from '../models/category'
const app = express();
app.use(express.static('public'))
app.set('view engine','ejs'); //for ejs
mongoose.connect('mongodb+srv://devsathwara008:dev123456@cluster0.tfdn46c.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('MongoDB is connected!')
})
app.use(bodyParser.urlencoded({extended: true}))

const categorySchema = new mongoose.Schema({
    name: {type:String, require: true}
},{ timestamps: true })
const catdetail = mongoose.model('Category',categorySchema);

const userSchema = new mongoose.Schema({
    username: {type:String, require:true},
    email: {type:String, require:true},
    profilePic: {type:String, require:true}
},{ timestamps: true })
const userdetail = mongoose.model('user',userSchema)

const contactSchema = new mongoose.Schema({
    firstName:{type:String, require:true},
    lastName:{type:String,require:true},
    email:{type:String,require:true},
    phoneNo:{type:String,require:true},
    Query:{type:String,require:true}
},{ timestamps: true })

const contactdetails = mongoose.model('contacts',contactSchema);

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      ops: {
        type: Array,
        required: false
      },
      photo: {
        type: String,
        required: false,
      },
      username: {
        type: String,
        required: true,
      },
      categories: {
        type: Array,
        required: false,
      },
    },
    { timestamps: true }
)
const postdetails = new mongoose.model('posts',postSchema);

const archiveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      ops: {
        type: Array,
        required: false
      },
      photo: {
        type: String,
        required: false,
      },
      username: {
        type: String,
        required: true,
      },
      categories: {
        type: Array,
        required: false,
      },
    },
    { timestamps: true }
)
const archivedetails = new mongoose.model('archive',archiveSchema);







app.get('/',(req,res)=>{
    res.render('home',{userId:null})
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})



app.get('/users', async (req,res)=>{
    let data = await userdetail.find();
    // console.log(data)
    res.render('users',{user:data})
})

app.get('/contact',async (req,res)=>{
    let data = await contactdetails.find()
    // console.log(data)
    res.render('contact',{contact:data})
})

app.post('/delete', async(req,res)=>{
    let {email} = req.body;
    let data = await contactdetails.deleteOne({email:email})
    res.redirect('/contact')
})

app.post('/deleteUser',async(req,res)=>{
    let {email} = req.body
    let data = await userdetail.deleteOne({email:email})
    res.redirect('/users')
})

app.post('/deleteCategory', async(req,res)=>{
    let {names}= req.body;
    let data = await catdetail.deleteOne({name:names})
    res.redirect('/category')
})

app.post('/addCategory',async (req,res)=>{
    let {name} = req.body;
    console.log(name)
    let data = new catdetail({
        name: name
    })
    data.save();
    res.redirect('/category')
    console.log(data)
})

app.post('/deletepost', async(req,res)=>{
    let {postID} = req.body;
    const data = await postdetails.deleteOne({_id:postID})
    if(data){
        res.redirect('/post')
    }
   else{
    // res.render('Not Deleted')
    console.log("!deleted")
   }
})

// app.post('/delete',async (req,res)=>{
//     let {email} = req.body;
//     let data = await User.deleteOne({email : email})
//     res.redirect('/users')
// })

app.get('/archive',async(req,res)=>{
    const archivedata = await archivedetails.find()
    const category = await catdetail.find()
    res.render('archive',{post:archivedata, category:category})
})

app.post('/archivepost', async(req,res)=>{
    let {postID} = req.body;
    const data = await postdetails.findOne({_id:postID})
    if(data){
        const archivePost= new archivedetails({
            title: data.title,
            ops: data.ops,
            photo: data.photo,
            username: data.username,
            categories: data.categories
        })
        try {
            const savedArchivePost = await archivePost.save();
            console.log('Archive post saved:', savedArchivePost);
            const deldata = await postdetails.deleteOne({ _id: postID });
            if (deldata) {
                console.log('Post deleted from postdetails');
            }
            res.redirect('/archive');
        } catch (error) {
            console.error('Error:', error);
            res.send('Error saving or deleting post');
        }
    }
})


  app.post('/archiveselected', async (req, res) => {
    const { category, month } = req.body;
  
    // Build a filter object based on selected category and month
    const filter = {};
  
    if (category !== '0') {
      filter.categories = category;
    }
  
    if (month !== '000') {
      // Assuming the month values in the database are stored as numbers (e.g., 1 for January, 2 for February)
      filter.createdAt = {
        $gte: new Date(`${2023}-${parseInt(month)}-01T00:00:00.000Z`),
        $lt: new Date(`${2023}-${parseInt(month) + 1}-01T00:00:00.000Z`),
      };      
    }
  
    try {
      const filteredPosts = await archivedetails.find(filter);
      const categoryList = await catdetail.find();
  
      res.render('archive', { post: filteredPosts, category: categoryList });
    } catch (error) {
      console.error('Error:', error);
      res.send('Error filtering posts');
    }
  });


  app.post('/postselects', async (req, res) => {
    const { category, month } = req.body;
  
    // Build a filter object based on selected category and month
    const filter = {};
  
    if (category !== '0') {
      filter.categories = category;
    }
  
    if (month !== '000') {
      // Assuming the month values in the database are stored as numbers (e.g., 1 for January, 2 for February)
      filter.createdAt = {
        $gte: new Date(`${2023}-${parseInt(month)}-01T00:00:00.000Z`),
        $lt: new Date(`${2023}-${parseInt(month) + 1}-01T00:00:00.000Z`),
      };      
    }
  
    try {
        const filteredPosts = await postdetails.find(filter);
        const categoryList = await catdetail.find();
        console.log(categoryList)
        res.render('post', { post: filteredPosts, category: categoryList });
      } catch (error) {
        console.error('Error:', error);
        res.send('Error filtering posts');
      }      
  });














// const postdetails = async ()=>{
//     app.get('/post',(req,res)=>{
//         res.render('post',{userId:null})
//     })
// }

app.get('/post',async(req,res)=>{
    let data = await postdetails.find()
    const categoryList=await catdetail.find();
    res.render('post',{post:data, category: categoryList})
})
app.get('/category',async (req,res)=>{
    let data = await catdetail.find()
    console.log(data)
    res.render('category',{category:data})
})
// app.get('/users',(req,res)=>{
//     res.render('users')
// })
// app.get('/contact',(req,res)=>{
//     res.render('contact')
// })