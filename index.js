const inquirer = require("inquirer");
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mary",
  port: 3306,
  database: "department_db",
});
const { printTable } = require("console-table-printer");
db.connect(() => {
  menu();
});
function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "options",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((response) => {
      if (response.options === "view all departments") {
        viewDepartments();
      }
      if (response.options === "view all roles") {
        viewRoles();
      }
      if (response.options === "view all employees") {
        viewAllEmployees();
      }
      if (response.options === "add a department") {
        addDepartment();
      }
      if (response.options === "add a role") {
        addRole();
      }
      if (response.options === "add an employee") {
        addEmployee();
      }
      if (response.options === "update an employee role") {
        updateEmployeeRole();
      }
    });
}
function viewDepartments() {
  db.query("select * from department", (err, data) => {
    printTable(data);
    menu();
  });
}
function viewRoles() {
  db.query("select * from role", (err, data) => {
    printTable(data);
    menu();
  });
}
function viewAllEmployees() {
  db.query("select * from employee", (err, data) => {
    printTable(data);
    menu();
  });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the new department?",
        name: "newDepartment",
      },
    ])
    .then((response) => {
      db.query(
        "insert into department(name)values(?)",
        response.newDepartment,
        (err) => {
          viewDepartments();
        }
      );
    });
}
function addRole() {
  db.query("select id value,title name from role", (err, data) => {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the new role?",
          name: "newRole",
        },
        {
          type: "input",
          message: "What is the salary for the new role?",
          name: "newSalary",
        },
        {
          type: "list",
          message: "What is the department id?",
          name: "departmentID",
          choices: data,
        },
      ])
      .then((response) => {
        db.query(
          "insert into role(title,salary,department_id)values(?,?,?)",
          [response.newRole, response.newSalary, response.departmentID],
          (err) => {
            viewRoles();
          }
        );
      });
  });
}
function addEmployee() {
  db.query(
    "select id value,concat(first_name,' ',last_name) name from employee",
    (err, employeeData) => {
      db.query("select id value, title name from role", (err, roleData) => {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the new employee first name?",
              name: "newFirstName",
            },
            {
              type: "input",
              message: "What is the new employee last name?",
              name: "newLastName",
            },
            {
              type: "list",
              message: "What is the new role id?",
              name: "newRoleID",
              choices: roleData,
            },
            {
              type: "list",
              message: "Who is the new employee manager?",
              name: "managerID",
              choices: employeeData,
            },
          ])
          .then((response) => {
            db.query(
              "insert into employee(first_name,last_name,role_id,manager_id)values(?,?,?,?)",
              [
                response.newFirstName,
                response.newLastName,
                response.newRoleID,
                response.managerID,
              ],
              (err) => {
                viewAllEmployees();
              }
            );
          });
      });
    }
  );
}
function updateEmployeeRole() {
  db.query(
    "select id value,concat(first_name,' ',last_name) name from employee",
    (err, employeeData) => {
      db.query("select id value, title name from role", (err, roleData) => {
        inquirer
          .prompt([
            {
              type: "list",
              message: "Which employee do you want to update the role of?",
              name: "employeeID",
              choices:employeeData
            },
            {
              type: "list",
              message: "What is the new role id for this employee?",
              name: "employeeRole",
              choices:roleData
            },
          ])
          .then((response) => {
            db.query(
              "update employee set role_id=? where id=?",
              [response.employeeRole, response.employeeID],
              (err) => {
                viewAllEmployees();
              }
            );
          });
      });
    }
  );
}
