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

const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What will the department be named?"
        }
    ])
    .then(({ name }) => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: name,
            },
            (err) => {
                if (err) throw err;
                console.log(`${name} added successfully`);
                choice();
            }
        );
    });
};

const addRole = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
        if (err) throw err;
        const departmentNames = departments.map(({name}) => { return name })
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What title will the new role have?"
            },
            {
                type: "input",
                name: "salary",
                message: "What salary will this rolle have?",
                validate(salary) {
                    return !isNaN(salary);
                }
            },
            {
                type: "input",
                name: "department",
                message: "What department will this role be under?",
                choices: departmentNames
            }
        ])
        .then(({ title, salary, department }) => {
            const department_id = departments.filter((departmentRow) => departmentRow.name == department )[0].id
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: title,
                    salary: salary,
                    department_id: department_id
                },
                (err) => {
                    if (err) throw err;
                    console.log(`${title} successfully added`);
                    choice();
                }
            );
        });
    });
};

addEmployee = () => {
    connection.query("SELECT * FROM role", (err, roles) => {
        if (err) throw err;
        const roletitle = roles.map(({title}) => { return title })
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the new employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the new employee's last name?"
            },
            {
                type: "list",
                name: "title",
                message: "What title will this employee have?",
                choices: roletitle
            }
        ])
        .then(({ first_name, last_name, title }) => {
            const role_id = roles.filter((roleRow) => roleRow.title == title )[0].id
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: first_name,
                    last_name: last_name,
                    role_id: role_id
                },
                (err) => {
                    if (err) throw err;
                    console.log(`${first_name} ${last_name} has been added successfully`);
                    choice();
                }
            )
        });
    });
};

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});
