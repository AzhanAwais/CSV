const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const ejs = require('ejs');
const db = require('./db/config');
const upload = require('express-fileupload');
const Data = require('./models/data');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;


// ===================== FUNCTIONS =========================

const fetchData = async()=>{
    const result = await Data.find();
    return result;
}

const fetchSpecificData = async(_id)=>{
    const result = await Data.findOne({_id});
    return result;
}

const DeleteData = async(_id)=>{
    const result = await Data.deleteOne({_id})
    if(result){
        return true
    }
    else{
        return false
    }
}

// ===================== FUNCTIONS =========================

app.use(express.static(path.join(__dirname,'../public')))
app.set('view engine', 'ejs');
app.use(upload());
app.use(bodyParser());


app.get('/', (req,res)=>{
    res.render("pages/index")
})

app.get('/admin/', async(req,res)=>{
    let result = await fetchData();
    res.render("pages/admin",{
        message:"",
        result
    })
})

app.get('/admin/upload', (req,res)=>{
    res.render("pages/upload",{
        message:''
    })
})

app.post('/admin/upload', (req,res)=>{
    let arr = [];
    if(req.files){
        let file = req.files.file;
        let filename = req.files.file.name;
        let ext = path.extname(filename)
        if(ext!='.csv'){
            res.render('/pages/upload',{
                message: 'Invalid File Format!',
                type:'Error'
            })
        }
        else{
            file.mv('./uploads/'+filename, function(err){
                if(err){
                    res.render("pages/upload",{
                        message: 'Error With Upload',
                        type:'Error'
                    })
                }
                else{
                    fileData = fs.createReadStream(path.join(__dirname,'/uploads/'+filename));
                    fileData.pipe(csv({})).on('data', (data)=>{
                        arr.push(data);
                    }).on('end',()=>{
                        let result = Data.insertMany(arr).then((data)=>{
                            arr=[];
                            res.render("pages/upload",{
                                message: "File Upload Successfull",
                                type:'Success'
                            })
                        }).catch((e)=>{
                            res.render("pages/upload",{
                                message: "Error",
                                type:'Error'
                            })
                        })
                    })
                }
            })
        }
    }
    else{
        res.render("pages/upload",{
            message: 'Please Select a CSV File',
            type:'Error'
        })
    }
})


app.post('/admin/uploadmanual', async(req,res)=>{
    console.log(req.body)
    let Name= req.body.name;
    let Age= req.body.age;
    let Phone= req.body.phone

    if(Name=='' || Age=='' || Phone==''){
        res.render("pages/upload",{
            message: 'Input Field Should Not Be Empty',
            type:'Error'
        })
    }
    else{
        const result = await new Data({
            Name: Name,
            Age: Age,
            Phone: Phone,
        })

        result.save((err, ques)=>{
            if(err){
                res.render("pages/upload",{
                    message: 'Unable To Save',
                    type:'Error'
                })
            }
            else{
                res.render("pages/upload",{
                    message: 'Data Saved Successfull',
                    type:'Success'
                })
            }
        })
    }
})

app.get('/admin/deletedata', async(req,res)=>{
    let _id = req.query.id;
    let ans = await DeleteData(_id);
    console.log(ans)
    let result = await fetchData()
    if(ans==true){
        res.render('pages/admin',{
            result,
            message:"Deleted Successfull",
            type:"Success"
        })
    }
    else{
        res.render('pages/admin',{
            result,
            message:"Error With Deletion",
            type:"Error"
        })
    }           
})


app.listen(port,()=>{
    console.log("listen")
})