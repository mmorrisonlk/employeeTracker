const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./connection');

const initialPrompt = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
]).then((answer) =>{
    switch(answer.choice) {
      case 'ADD_DEPARTMENT':
        inquirer.prompt([
          { name: 'name', message: 'What is the name of the department?'}
        ])
        .then((department) => {
          connection.query("INSERT INTO department SET ?", department, () => {
            initialPrompt();
          });
        });
      break;
      case 'VIEW_DEPARTMENTS':
        connection.query("SELECT * FROM department", (error, data) => {
          console.table(data);
          initialPrompt();
        });
      break;
      case 'ADD_ROLE':
        connection.query("SELECT name, id AS value FROM department", (error, departments) => {
          inquirer.prompt([
            { name: 'title', message: 'What is the title?'},
            { name: 'salary', message: 'What is the Salary?'},
            { type: 'list', name: 'department_id', message: 'What is the department?', choices: departments},
            ])
          .then((role) => {
            connection.query("INSERT INTO role SET ?", role, () => {
              initialPrompt();
            });
          });
        })
      break;
      case 'VIEW_ROLES':
        connection.query("SELECT * FROM role JOIN department ON role.department_id = department.id", (error, data) => {
          console.table(data);
          initialPrompt();
        });
      break;
      case 'ADD_EMPLOYEE':
        connection.query("SELECT id AS value, first_name AS name FROM employee WHERE manager_id IS NULL", (error, managers) => {
          connection.query("SELECT id AS value, title AS name FROM role", (error, roles) => {
            inquirer.prompt([
              { name: 'first_name', message: 'What is their first name?'},
              { name: 'last_name', message: 'What is their last name?'},
              { type: 'list', name: 'role_id', message: 'What is the role id?', choices: roles},
              { type: 'list', name: 'manager_id', message: 'Who is their manager?', choices: [{ value: null, name: 'None' }].concat(managers || []) },
              ])
            .then((employee) => {
              connection.query("INSERT INTO employee SET ?", employee, () => {
                initialPrompt();
              });
            });
          })
        });
      break;
      case 'VIEW_EMPLOYEES':
        connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id", (error, data) => {
          console.table(data);
          initialPrompt();
        });
      break;
      case 'UPDATE_EMPLOYEE_ROLE':
        connection.query("SELECT id AS value, first_name AS name FROM employee", (error, employees) => {
          connection.query("SELECT id AS value, title AS name FROM role", (error, roles) => {
            inquirer.prompt([
              { type: 'list', name: 'id', message: 'Which employee?', choices: employees},
              { type: 'list', name: 'role_id', message: 'Which role?', choices: roles},
            ]).then((answers) => {
              connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.role_id, answers.id], (error) => {
                initialPrompt();
              });
            });
        });
      });
      break;
      default:
        process.exit();
      break;
    }
});
}

initialPrompt();