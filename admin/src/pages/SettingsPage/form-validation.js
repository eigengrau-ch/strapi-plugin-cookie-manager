
// Yup Validation
import * as Yup from "yup"

const settingsSchema = Yup.object().shape({
  localization: Yup
    .boolean()
    .required("Required"),
});

export default settingsSchema
