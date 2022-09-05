
// Yup Validation
import * as Yup from "yup"

// Utils
import { getTrad } from "../../utils";

const ValidationSchema = (formatMessage) => {
  const msg = {
    string: {
      isRequired: formatMessage({
        id: getTrad("form.validation.string.isRequired"),
        defaultMessage: "Text cannot be empty"
      }),
      isMax: formatMessage({
        id: getTrad("form.validation.string.isMax"),
        defaultMessage: "Text is to long"
      }),
      isDomain: formatMessage({
        id: getTrad("form.validation.string.isDomain"),
        defaultMessage: "Text must be a domain e.G example.com"
      }),
    },
    number: {
      isMax: formatMessage({
        id: getTrad("form.validation.number.isMax"),
        defaultMessage: "Number is to large"
      }),
      isPositiv: formatMessage({
        id: getTrad("form.validation.number.isPositiv"),
        defaultMessage: "Number cannot be negative"
      }),
      isInteger: formatMessage({
        id: getTrad("form.validation.number.isInteger"),
        defaultMessage: "Number cannot be decimal"
      }),
    }
  }

  return Yup.object().shape({
    name: Yup
      .string()
      .required(msg.string.isRequired),

    description: Yup
      .string()
      .max(140, msg.string.isMax),

    host: Yup
      .string()
      .required(msg.string.isRequired)
      .matches(/(?:\w+\.)+\w+/i, msg.string.isDomain),

    category: Yup
      .string()
      .nullable()
      .required(msg.string.isRequired),

    party: Yup
      .string()
      .nullable()
      .required(msg.string.isRequired),

    durationDays: Yup
      .number()
      .min(0, msg.number.isPositiv)
      .integer(msg.number.isInteger),

    durationHours: Yup
      .number()
      .min(0, msg.number.isPositiv)
      .integer(msg.number.isInteger)
      .max(24, msg.number.isMax),

    durationMinutes: Yup
      .number()
      .min(0, msg.number.isPositiv)
      .integer(msg.number.isInteger)
      .max(60, msg.number.isMax),
  })
};

export default ValidationSchema
