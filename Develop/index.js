const inquirer = require('inquirer');
const connection = require('./connection')

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
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
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
          name: "Remove Role",
          value: "REMOVE_ROLE"
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
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
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
        .then((answer) => {
          connection.query("INSERT INTO department SET ?", department, () => {
            initialPrompt();
          });
        });
      break;
      case 'VIEW_DEPARMENTS':
        connection.query("SELECT * FROM department", (error, data) => {
          console.table(data);
          initialPrompt();
        });
      break;
      case 'ADD_ROLE':
        connection.query("SELECT name, id AS value FROM department", (error, departments) => {
          inquirer.prompt([
            { name: 'title', message: 'What is the title?'},
            { name: 'salary', message: 'What is the Salary'},
            { type: 'list', name: 'department_id', message: 'What is the department?', choices: departments},
            ])
          .then((role) => {
            connection.query("INSERT INTO role SET ?", department, () => {
              initialPrompt();
            });
          });
        })
      break;
    }
})  
}

initialPrompt();