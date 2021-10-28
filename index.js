const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const sequelize = require('./config/connection');

const PORT = process.env.PORT || 3001;

const choice = () => {
    inquirer.prompt({
        type: "list",
        name: "first",
        message: "What would you like to do?",
        choices: [
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Exit"
        ],
    })
    .then(({ choice }) => {
        console.log(choice);
        switch (choice) {
            case "View all Departments":
                viewDepartments();
                break;
            case "View all Roles":
                viewRoles();
                break;
            case "View all Employees":
                viewEmployees();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            default:
                connection.end()
        }
    });
};

const viewDepartments = () => {
    connection.query("SELECT name FROM department", (err, results) => {
        if (err) throw err;
        console.table(results);
        choice();
    });
};

const viewRoles = () => {
    connection.query("SELECT name AS department_name, title, salary FROM role INNER JOIN department ON department.id = role.department_id", (err, results) => {
        if (err) throw err;
        console.table(results);
        choice();
    });
};

const viewEmployees = () => {
    connection.query("SELECT first_name, last_name, title, salary FROM employee INNER JOIN role ON role.id = employee.role_id", (err, results) => {
        if (err) throw err;
        console.table(results);
        choice();
    });
};

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});
