import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;  
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;
  if(token){
    jwt.verify(token,"1234567890qwertyuiop)(*&^%$#@!",(err,user)=>{
      if(err){
        res.status(403).json({message:"Invalid Token"})
        return
      }
      req.user = user;
      next()
    })
  }else{
    res.status(401).json({message:"Token is missing"})
  }
}