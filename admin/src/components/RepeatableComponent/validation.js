
// Yup Validation
import * as Yup from "yup"

// Utils
import { getTrad } from "../../utils";

const ValidationSchema = (formatMessage) => {
  const msg = {
    string: {
      isRequired: formatMessage({
        id: getTrad("form.validation.string.isRequired"),
        defaultMessage: "Field cannot be empty"
      }),
    },
    mixed: {
      isOneOf: formatMessage({
        id: getTrad("form.validation.mixed.isOneOf"),
        defaultMessage: "Must have selected one of the options"
      }),
    }
  }

  return Yup.object().shape({
    buttonType: Yup
      .mixed()
      .oneOf(["Primary", "Secondary", "Text"], msg.mixed.isOneOf),

    label: Yup
      .string()
      .required(msg.string.isRequired),
  })
}

export default ValidationSchema
