
// Yup Validation
import * as Yup from "yup"

// Utils
import { getTrad } from "../../utils";

const ValidationSchema = (formatMessage, min, max, moreThanOne) => {
  const msg = {
    string: {
      isRequired: formatMessage({
        id: getTrad("form.validation.string.isRequired"),
        defaultMessage: "Field cannot be empty"
      }),
      isMax: formatMessage({
        id: getTrad("form.validation.string.isMax"),
        defaultMessage: "Field text is to long"
      })
    },
    array: {
      isMin: formatMessage({
        id: getTrad("form.validation.array.isMin"),
        defaultMessage: "Field has less than { amount } { moreThanOne, select, true { entries } other { entry }"
      },{
        amount: min,
        moreThanOne: moreThanOne
      }),
      isMax: formatMessage({
        id: getTrad("form.validation.array.isMax"),
        defaultMessage: "Field has more than { amount } { moreThanOne, select, true { entries } other { entry }"
      }, {
        amount: max,
        moreThanOne: moreThanOne
      }),
    }
  }

  return Yup.object().shape({
    title: Yup
      .string()
      .required(msg.string.isRequired)
      .max(125, msg.string.isMax),

    description: Yup
      .string()
      .max(2000, msg.string.isMax),

    buttons: Yup
      .array()
      .min(1, msg.array.isMin)
      .max(3, msg.array.isMax)
  })
};

export default ValidationSchema
