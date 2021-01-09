CREATE TABLE "todo" (
    "id" SERIAL PRIMARY KEY,
    "task" VARCHAR(250) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "date_added" DATE NOT NULL,
    "complete_by" DATE,
    "completed" BOOLEAN DEFAULT false
);

CREATE TABLE "category" (
    "id" SERIAL PRIMARY KEY,
    "category" VARCHAR(20) NOT NULL
);

INSERT INTO "todo"(task, category, date_added, complete_by, completed)
VALUES ('Walk dog', 'Home', '1-6-2021', '1-8-2021', false),
('Cut grass', 'Home', '12-2-2020', '12-31-2020', true),
('Quit job', 'Work', '9-4-2020', '1-1-2030', false);

INSERT INTO "category"(category)
VALUES ('Home'), ('Work'), ('School'), ('Urgent');

DROP TABLE "todo";