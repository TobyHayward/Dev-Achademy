BEGIN TRANSACTION;

CREATE TYPE level AS ENUM ('Level 5', 'Level 6');

CREATE TYPE grade AS ENUM ('A+', 'A', 'A-','B+', 'B', 'B-','C+', 'C', 'C-', 'D', 'E');


CREATE TABLE grade_scale (
    id SERIAL PRIMARY KEY,
    level level,
    min_mark int,
    max_mark int,
    grade grade,
    UNIQUE (level, grade)
);

COMMIT;