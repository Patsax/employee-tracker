const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",

    // Name of the Database
    database: "employee_tracker"
});

const choice = () => {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit",
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
                    connection.end();
                    break;
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
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the new department?",
            },
        ])
        .then(({ name }) => {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: name,
                },
                (err) => {
                    if (err) throw err;
                    console.log(`${name} successfully added!`);
                    choice();
                }
            );
        });
};

const addRole = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
        if (err) throw err;
        const departmentNames = departments.map(({name}) => { return name })
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title of the new role?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What salary will this role have?",
                    validate(salary) {
                        return !isNaN(salary);
                    },
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department will the role be under?",
                    choices: departmentNames,
                },
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
                        console.log(`${title} added successfully!`);
                        choice();
                    }
                );
            });
            
    });
};

const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, roles) => {
        if (err) throw err;
        const roletitle = roles.map(({title}) => { return title })
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the first name of the new employee?",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the last name of the new employee?",
                },
                {
                    name: "title",
                    type: "list",
                    message: "What title will the employee have?",
                    choices: roletitle,
                },
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
                        console.log(`${first_name} ${last_name} has successfully been added!`);
                        choice();
                    }
                );
            });
            
    });
};

const updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;
        const employeeNames = employees.map(({first_name, last_name}) => { return `${first_name} ${last_name}` })
        
        connection.query("SELECT * FROM role", (err, roles) => {
            if (err) throw err;
            const employeeRoles = roles.map(({title}) => {return title})

        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employeeNames,
                },
                
                {
                    name: "title",
                    type: "list",
                    message: "What new title will the employee have?",
                    choices: employeeRoles,
                },
            ])
            .then(({ employee, title }) => {
                const role_id = roles.filter((roleRow) => roleRow.title == title )[0].id
                const employee_id = employees
                .filter(({first_name, last_name}) => `${first_name} ${last_name}` == employee)[0].id;
                const query = `UPDATE employee SET role_id=${role_id} WHERE id=${employee_id}`
                connection.query( 
                    query,
                    (err) => {
                        if (err) throw err;
                        console.log(`You successfully changed ${employee} to ${title}!`);
                        choice();
                    }
                );
            });
        });
    });
}

connection.connect((err) => {
    if (err) throw err;

    console.log("\n\n ____  __  __  ____  __    _____  _  _  ____  ____    ____  ____    __    ___  _  _  ____  ____ ")
    console.log("( ___)(  \\/  )(  _ \\(  )  (  _  )( \\/ )( ___)( ___)  (_  _)(  _ \\  /__\\  / __)( )/ )( ___)(  _ \\ ")
    console.log(" )__)  )    (  )___/ )(__  )(_)(  \\  /  )__)  )__)     )(   )   / /(__)\\( (__  )  (  )__)  )   / ")
    console.log("(____)(_/\\/\\_)(__)  (____)(_____) (__) (____)(____)   (__) (_)\\_)(__)(__)\\___)(_)\\_)(____)(_)\\_) \n\n")

    choice();
});
