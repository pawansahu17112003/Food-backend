var multer=require('multer')
var storage=multer.diskStorage({
    destination:function(req,file,path){
        path(null,'public/images')

    },

 filename:function(req,file,path){
    path(null,file.originalname)
 }
    
})

var upload=multer({storage:storage})
module.exports=upload