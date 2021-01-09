CREATE TABLE "todo" (
    "id" SERIAL PRIMARY KEY,
    "task" VARCHAR(250) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "completed" BOOLEAN DEFAULT false
);

CREATE TABLE "category" (
    "id" SERIAL PRIMARY KEY,
    "category" VARCHAR(20) NOT NULL
);

INSERT INTO "todo"(task, category, completed)
VALUES ('Walk dog', 'Home', false),
('Cut grass', 'Home', true),
('Quit job', 'Work', false);

INSERT INTO "category"(category)
VALUES ('Home'), ('Work'), ('School'), ('Urgent');