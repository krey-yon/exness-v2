import type { Request, Response } from "express";

export async function createUser(req: Request, res: Response){
    const {username, email, password} = req.body;

    if(!username && !email && !password){
        return res.send("all fields are required")
    }
    
}