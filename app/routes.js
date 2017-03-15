var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  
  res.render('index');

});

router.get('/prototypes/simultaneous-receipt-and-recovery/send-receipt', function (req, res) {


  var certificate = req.query.certificate;

  if (certificate == "recovery"){

    // redirect to the relevant page
    res.redirect("/prototypes/simultaneous-receipt-and-recovery/send-recovery");

  } else if (certificate == "receipt_recovery"){

    // if certificate is any other value (or is missing) render the page requested
    res.redirect('/prototypes/simultaneous-receipt-and-recovery/send-receipt-recovery');

  } else {

    // if certificate is any other value (or is missing) render the page requested
    res.render('prototypes/simultaneous-receipt-and-recovery/send-receipt');

  }

});

module.exports = router;
