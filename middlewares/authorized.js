const jwt = require('jsonwebtoken');
const user = require('../models/user');
const company = require('../models/company');

module.exports = function(req, res, next){
  const token = req.cookies['authorized_token'];

  if(token){
    jwt.verify(token, process.env.SECRET, async function(error, decodedToken){
      if(error){
        res.redirect('/login');
      }else{
        const $ = await user.findById(decodedToken.id);
        
        if($){
          const companies = $.work_at;
          const _companies = companies.map(function(c){
            return company.findById(c.company_id);
          });

          const $companies = await Promise.all(_companies);

          res.locals.user = $;
          res.locals.companies = $companies;
        }else{
          res.locals.user = null;
        }

        next();
      }
    });
  }else{
    res.redirect('/login');
  }
}