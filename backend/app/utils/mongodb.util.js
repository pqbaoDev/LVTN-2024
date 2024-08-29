const mongoose = require('mongoose');

class Mongoose {
    static client = null; // Khởi tạo client là null

    static connect = async (uri) => {
        if (this.client) return this.client;
        this.client = await mongoose.connect(uri);
        return this.client;
    };
}

module.exports = Mongoose;
