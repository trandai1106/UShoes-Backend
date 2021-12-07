const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.seed = async () => {
    User.deleteMany().then(() => {
        console.log('User is cleared');
    }).catch((err) => { 
        console.log(err);
    });


    const Users = [
        {
            "phone": "0941740238",
            "name": "Trần Quang Đại",
            "password": await bcrypt.hash("123456789", await bcrypt.genSalt()),
            "role": "admin"
        },
        {
            "phone": "0941740237",
            "name": "Trần Văn Quang",
            "password": await bcrypt.hash("123456789", await bcrypt.genSalt()),
            "role": "sale"
        },
        {
            "phone": "0941740236",
            "name": "Nguyễn Thanh Tùng",
            "password": await bcrypt.hash("123456789", await bcrypt.genSalt()),
            "role": "customer"
        }
    ];

    for (var i = 0; i < Users.length; ++i) {
        const user = Users[i];
        await User.create({
            phone: user.phone,            
            name: user.name,      
            password: user.password,
            role: user.role,
        });
    };

    console.log('User is seeded');
};