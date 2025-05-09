const app = require("./app");
const config = require("./app/database");
const Mongoose = require("./app/utils/mongodb.util");

async function StartServer() {
    try {
        await Mongoose.connect(config.db.uri);
        console.log("Connected to the database!");

        const PORT = config.app.port;
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}.`);
        })

    } catch (error) {
        console.log("Cannot connect to the database",error);
        process.exit();
        
    }
}
StartServer();
