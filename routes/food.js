var express = require('express');
var router = express.Router();
var pool = require("./pool.js")
var upload = require('./multer.js');
const { raw } = require('mysql');


router.get('/food_interface', function (req, res, next) {
  try {
    var admin = localStorage.getItem("ADMIN")
    if (!admin) { res.render('loginpage', { message: ' ' }) }
    else {
      res.render('foodinterface', { message: ' ' });
    }
  } 
  catch (e) {
    res.render('loginpage', { message: ' ' })
  }

});

router.get('/edit_food_interface', function (req, res, next) {
  res.render('editfoodinterface', { message: ' ' });
});
router.get('/food_list', function (req, res, next) {
  try {
    var admin = localStorage.getItem("ADMIN")
    if (!admin) { res.render('loginpage', { message: ' ' }) }
    else {


      try {
        pool.query("select * from foods ", function (error, result) {
          if (error) {
            res.render('foodlist', { data: [], message: "Error:pls contact to Database Administrator.......", status: false })
          }
          else {
            res.render('foodlist', { data: result, message: " Success", status: true })


          }

        })


      }
      catch (e) {
        res.render('foodlist', { data: [], message: " Critical Error:pls contact to  Server Administrator.......", status: false })


      }
    }
  }
catch (e) {
      res.render('loginpage', { message: ' ' });
    }


  });

router.get("/fetch_all_food_category", function (req, res) {
  try {
    pool.query("select * from category ", function (error, result) {
      if (error) {
        res.json({ data: [], message: "Error:pls contact to Database Administrator.......", status: false })
      }
      else {
        res.json({ data: result, message: " Success", status: true })


      }

    })


  }
  catch (e) {
    res.json({ data: [], message: " Critical Error:pls contact to  Server Administrator.......", status: false })


  }


})

router.get("/fetch_all_food_subcategory", function (req, res) {
  try {
    pool.query("select * from subcategory where categoryid=? ", [req.query.categoryid], function (error, result) {
      if (error) {
        res.json({ data: [], message: "Error:pls contact to Database Administrator.......", status: false })
      }
      else {
        res.json({ data: result, message: " Success", status: true })


      }

    })


  }
  catch (e) {
    res.json({ data: [], message: " Critical Error:pls contact to  Server Administrator.......", status: false })


  }

})






router.post('/food_submit', upload.single("picture"), function (req, res, next) {

  if (req.body.foodtype == undefined) {
    req.body.foodtype = "vegeterian"
  }

  try {
    pool.query("insert into foods( categoryid, subcategoryid, foodname, ingredients, price, halfprice, offer, status, foodtype, picture) values(?,?,?,?,?,?,?,?,?,?)", [req.body.categoryid, req.body.subcategoryid, req.body.foodname, req.body.ingredients, req.body.price, req.body.halfprice, req.body.offer, req.body.status, req.body.foodtype, req.file.filename], function (error, result) {

      if (error) {
        res.render("foodinterface", { message: "Error:pls contact to Database Administrator.......", status: false })
      }
      else {
        res.render("foodinterface", { message: " Record Submitted Successfully", status: true })
      }
    })


  }
  catch (e) {
    res.render("foodinterface", { message: " Critical Error:pls contact to  Server Administrator.......", status: false })


  }
})
router.get('/display_food', function (req, res, next) {


  try {

    pool.query(" select F.*,(select C.categoryname from category C where C.categoryid = F.categoryid) as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid = F.subcategoryid) as subcategoryname from foods F where foodid=?", [req.query.foodid], function (error, result) {
      if (error) {
        res.render('displayfood', { data: [], message: "Error:pls contact to Database Administrator.......", status: false })
      }
      else {
        if(result.length==1){
        res.render('displayfood', { data: result[0], message: "Success ", status: true })}
      else {
      res.render('editfoodinterface', { data:[], message: "Food does not exist.....", status: false })}


      }

    })


  }
  catch (e) {
    res.render('foodlist', { data: [], message: " Critical Error:pls contact to  Server Administrator.......", status: false })


  }


});
router.post('/food_edit', function (req, res, next) {
  var btn = req.body.btn
  if (btn == "Edit") {
    

    try {
      pool.query(" update foods set categoryid=?, subcategoryid=?, foodname=?, ingredients=?, price=?, halfprice=?, offer=?, status=?, foodtype=? where foodid=? ", [req.body.categoryid, req.body.subcategoryid, req.body.foodname, req.body.ingredients, req.body.price, req.body.halfprice, req.body.offer, req.body.status, req.body.foodtype, req.body.foodid], function (error, result) {

        if (error) {
          res.redirect("/food/food_list")
        }
        else {
          res.redirect("/food/food_list")
        }
      })


    }
    catch (e) {
      res.redirect("/food/food_list")
    }
  }
  else {
    try {
      pool.query(" delete from foods  where foodid=? ", [req.body.foodid], function (error, result) {

        if (error) {
          res.redirect("/food/food_list")
        }
        else {
          res.redirect("/food/food_list")
        }
      })


    }
    catch (e) {
      res.redirect("/food/food_list")
    }
  }



})

router.get('/edit_picture', function (req, res, next) {
  res.render("editpicture", { data: req.query })

})

router.post('/submit_edit_picture', upload.single("picture"), function (req, res, next) {


  try {
    pool.query("update foods set picture=? where foodid=?", [req.file.filename, req.body.foodid], function (error, result) {

      if (error) {
        res.redirect("/food/food_list")
      }
      else {
        res.redirect("/food/food_list")
      }
    })
  }

  catch (e) {
    res.redirect("/food/food_list")
  }

})
module.exports = router;
