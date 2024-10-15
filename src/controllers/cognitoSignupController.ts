import { Request, Response } from "express";
import AWS from "aws-sdk";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
config();

const cognito = new AWS.CognitoIdentityServiceProvider();

export const signup = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  try {
    const params: any = {
      ClientId: process.env.AWS_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };

    const data = await cognito.signUp(params).promise();
    res.status(201).json(data);
  } catch (err) {
    logger.error("error", { stack: err });
    res.status(500).json({ error: "Error in signup", data: err });
  }
};

export const confirmOTP = async (req: Request, res: Response) => {
  const { username, otp } = req.body;
  try {
    const params: any = {
      ClientId: process.env.AWS_CLIENT_ID,
      Username: username,
      ConfirmationCode: otp,
    };
    const data = await cognito.confirmSignUp(params).promise();
    res.status(201).json(data);
  } catch (err) {
    logger.error("error", { stack: err });
    res.status(500).json({ error: "Error in OTP Generating", data: err });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const params: any = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.AWS_CLIENT_ID,
      AuthParameters: { USERNAME: username, PASSWORD: password },
    };
    const data = await cognito.initiateAuth(params).promise();
    const token = jwt.sign(
      {
        username: data.AuthenticationResult?.AccessToken,
      },
      "1234567890qwertyuiop)(*&^%$#@!",
      { expiresIn: "3h" }
    );
    res.status(201).json({ token: token, data: data });
  } catch (err) {
    logger.error("error", { stack: err });
    res.status(500).json({ error: "Error in signing", data: err });
  }
};
