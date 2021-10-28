var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Good@eats1234',
    database: 'employee_tracker',
    port: 3306
});



connection.connect((err) => {
    if (err) throw err
    prompt();
});
