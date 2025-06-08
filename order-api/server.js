const app = require('./src/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/test', function(request, response) {
  response.send('Orders application Rest Service Working Fine');
});

app.get('/api/adminAPIList', function(request, response) {
  response.sendFile('adminAPIList.html', {root: __dirname })
});