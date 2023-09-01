const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
  check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required!')
    //.not()
    .isString()
    .withMessage('Must be a valid name!')
    .isLength({ min: 3, max: 10 })
    .withMessage('Name must be within 3 to 10 character!'),
  check('email').normalizeEmail().isEmail().withMessage('Invalid email!'),
  check('phonenumber')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Phone Number  is required!')
  .isLength({min:11,})
  .withMessage('Phone Number must be 11 character!'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is empty!')
    .isLength({ min: 5, max: 12 })
    .withMessage('Password must be 5 to 12 characters long!'),
  check('confirmPassword')
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Both password must be same!');
      }
      return true;
    }),
];
// exports.validateDoc = [
//   check('doc_name')
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage('Name is required!'),

//     check('description')
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage('description is required!'),
      
//     check('document')
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage('document is required!')
    
// ];

exports.userVlidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};

exports.validateUserSignIn = [
  check('email').trim().isEmail().withMessage(' Invalid email or password'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage(' Invalid email or password'
      //'email / password is required!'
    
    ),
];