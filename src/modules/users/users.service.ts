import { QueryInput } from "../../base/crudService";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { convert_vi_to_en } from "../../helper/string_handling";
import { usersModel } from "./users.model";
import nodemailer from 'nodemailer'

export async function getAllUsers(queryInput: QueryInput = {}) {
    return getDataWithPagination(queryInput, usersModel);
}



export async function getUserById(_id: String): Promise<Users | any> {
    try {
        const user: Users = await usersModel.findById(_id).lean();
        if (user === null) {
            return [];
        }
        return user;
    } catch (err) {
        console.log(err);

        return null;
    }
}

export async function getUserByName(name: String): Promise<Users | any> {

    try {
        const user = await usersModel.find();

        if (user === null) {
            return [];
        }

        const filterByName = (await (Promise.resolve(user))).filter((item: Users) => {
            const engName = convert_vi_to_en(name)
            const engItemName = convert_vi_to_en(item.name)
            return engItemName.includes(engName)

        })

        //Pagination
        
        return filterByName;
    } catch (err) {
        console.log(err);

        return null;
    }
}

export async function getByEmail(email: String): Promise<Users | any> {
    try {
        const users = await usersModel.findOne({ email: email });

        if (users === null) {
            return [];
        }

        return users;

    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function getByPhone(phone: String): Promise<Users | any> {
    try {
        const users = await usersModel.findOne({ phone: phone });

        if (users === null) {
            return [];
        }

        return users;

    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function sendActiveCode(email: String, code: Number) {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Sending active code',
        text: `Active code : ${code}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return null
        } else {
            return true
        }
    });
}

export async function createUsers(usersArgs: Users) {
    try {
        const users: Users = await usersModel.create(usersArgs);

       return users;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function updateUsers(_id: String, data: any) {
   
    try {
        const users = await usersModel.findByIdAndUpdate(
            _id,
            {
                $set: {...data,...{updatedAt: Date.now()}}
            },
            {
                new: true,
                timestamps: false
            }
        )

       return users;
    } catch (err) {
        console.log(err);

        return null;
    }
}

export async function activeUser(_id:String,code:Number) {
    try {
        const user = await usersModel.findByIdAndUpdate(
            _id,
            {
                $set:{
                    isActive:true,
                    updatedAt: Date.now()
                }
            },
            {
                new: true,
                timestamps: false
            }
        )

        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function changePassword(_id:String,password:String) {
    try {
        const user = await usersModel.findByIdAndUpdate(
            _id,
            {
                $set:{
                    password: password,
                    updatedAt: Date.now()
                }
            },
            {
                new: true,
                timestamps: false
            }
        )

        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function updateActiveCode(_id:String,code:Number) {
    try {
        const user = await usersModel.findByIdAndUpdate(
            _id,
            {
                $set:{
                    activeCode:code,
                    updatedAt: Date.now()
                }
            },
            {
                new: true,
                timestamps: false
            }
        )

        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function deleteUsers(_id: String) {
    try {
        const users = await usersModel.findByIdAndDelete(_id);

        return users;
    } catch (err) {
        console.log(err);

        return null;
    }
}
