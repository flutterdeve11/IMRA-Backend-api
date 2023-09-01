const mongoose = require('mongoose');
mongoose
.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
})
.then(() => {
  console.log('our db is connected');
}).catch(err => console.log(err.message));