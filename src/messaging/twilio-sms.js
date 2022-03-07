import twilio from "twilio";
import config from "../config.js";
import { logger } from "../logger/index.js";

const { accountSid, authToken, smsPhoneNumber, wspPhoneNumber } = config.twilio;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const messageOptions = {
      body: message,
      from: smsPhoneNumber,
      to
    };
    const messageInfo = await client.messages.create(messageOptions);
    logger.debug(messageInfo);
  } catch (error) {
    logger.error(error);
  }
};

const sendWSP = async (to, message) => {
  try {
    const messageOptions = {
      body: message,
      from: wspPhoneNumber,
      to: `whatsapp:${to}`
    };
    const messageInfo = await client.messages.create(messageOptions);
    logger.debug(messageInfo);
  } catch (error) {
    logger.error(error);
  }
};

export { sendSMS, sendWSP };
