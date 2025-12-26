import Joi from "joi";

export const sendMessageSchema = Joi.object({
  text: Joi.string().max(1000).allow("", null).optional(),
  image: Joi.any().optional(),
});
