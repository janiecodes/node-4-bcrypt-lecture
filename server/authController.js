const bcrypt = require('bcrypt');
//bcrypt is always in the controller file
//create salt using bcrypt.genSaltSync(10) - asynchronous
//create hash using bcrypt.hashSync(password, salt)


module.exports = {
    register: async (req, res) => { //add async in front of the function to replace .then and .catch
        const db = req.app.get('db');
        const {email, username, password} = req.body

        //this will replace .then and .catch 
        //A computer doesn't like to wait for things - with await it tells the computer to wait 
        const user = await db.check_user(email)
        //when dealing with SQL, an array always returns
        //we created a new variable user that is waiting on a response from the database

        if(user[0]){ //pick the first item in the array and this is truthy (aka a user in the first index)
            return res.status(409).send("User already exists")
        }
        //once we get a response, if that username is already in use then no go

        //if not, then keep going below
        //create a Hash password
        const salt = bcrypt.genSaltSync(10); //this hits the random salt button 10 times
        const hash = bcrypt.hashSync(password, salt); //password is from req.body
        // const newUser = await db.add_user([username, email, hash]) //always use an array with SQL
        //make sure to pass in hash and NOT password for security 
        //newUser is an array with an object of a new user inside
        const [newUser] = await db.add_user([username, email, hash])
        //this way is better 

        //add an object in the session
        req.session.user = {
            userId: newUser.user_id,
            email: newUser.email,
            username: newUser.username
        }
        res.status(200).send(req.session.user);
        //send to the front end 
    },
    login: async (req, res) => {
        const db = req.app.get('db');
        const {email, password} = req.body

        const user = await db.check_user(email);

        if(!user[0]){ //don't overlook the bang operator 
            res.status(401).send("Incorrect credentials") //only if the email is wrong give them this error
        }

        //if the email does exist then below
        const authenticated = bcrypt.compareSync(password, user[0].password) //user[0].password is the hash value
        if(authenticated){ //if authenticated is true then create a user session
            req.session.user = {
                userId: user[0].user_id,
                email: user[0].email,
                username: user[0].username
            }
            res.status(200).send(req.session.user)
        }else { //if the passwords don't match/authentification is false
            res.status(401).send('Incorrect credentials')
        }
    },
    logout: (req, res) => {
        req.session.destroy(); //this is the session method that deletes everything in the session
        res.sendStatus(200); //this will send the default message associated with the status number
    },
    getUser: (req, res) => { //only purpose to check to see if there is a user object on the session
        if(req.session.user){
            res.status(200).send(req.session.user)
        }else{
            res.sendStatus(404);
        }
    }
}