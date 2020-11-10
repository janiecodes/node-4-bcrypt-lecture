INSERT INTO users
(username, email, password)
VALUES
($1, $2, $3)
RETURNING *;

-- insert a user and then retrieve the information back