INSERT INTO department (id, name)
VALUES 
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal');

INSERT INTO role (id, title, salary, department_id) 
VALUES 
    (1, 'Sales Lead', 100000, 1),
    (2, 'Sales Person', 80000, 1),
    (3, 'Lead Engineer', 150000, 2),
    (4, 'Engineer', 120000, 2),
    (5, 'Accountant', 125000, 3),
    (6, 'Head of Legal', 250000, 4),
    (7, 'Lawyer', 190000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Rick', 'Pick', 1, NULL),
    (2, 'Zoey', 'Nelson', 2, 1),
    (3, 'Morty', 'Henderson', 2, 1),
    (4, 'Richard', 'Rahl', 2, 1),
    (5, 'Kahlan', 'Amnell', 3, NULL),
    (6, 'Cara', 'Doon', 4, 5),
    (7, 'Felix', 'Felder', 4, 5),
    (8, 'Jaina', 'Neidmeier', 5, NULL),
    (9, 'Landon', 'Meier', 5, NULL),
    (10, 'Cora', 'Namor', 5, NULL),
    (11, 'Kimberly', 'Feldon',5, NULL),
    (12, 'Gemma', 'Simmons', 6, NULL),
    (13, 'Rebecca', 'Meier', 7, 12),
    (14, 'Albert', 'Wesker', 7, 12),
    (15, 'Misha', 'Yovovich', 7, 12);
