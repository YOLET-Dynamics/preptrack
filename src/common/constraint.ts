import * as yup from "yup";

export const stringIDConstraint = (optional: boolean) => {
  const yupObj = yup
    .string()
    .required("ID is required")
    .length(36, "ID has invalid length");

  return optional ? yupObj.notRequired() : yupObj;
};

export const numberIDConstraint = (optional: boolean) => {
  const yupObj = yup
    .number()
    .required("ID is required")
    .typeError("ID must be a number")
    .min(1, "ID must be minimum 1");

  return optional ? yupObj.notRequired() : yupObj;
};

export const nameConstraint = (field: string, optional: boolean) => {
  const constraint = yup
    .string()
    .required(`${field} is required`)
    .min(2, `${field} should be minimum 2 characters`)
    .max(24, `${field} should be maximum 24 characters`)
    .matches(/^[A-Za-z0-9\s-]+$/, `${field} should only contain letters`);

  return optional ? constraint.notRequired() : constraint;
};

export const digitConstraint = (optional: boolean, field: string) => {
  const yupObj = yup
    .string()
    .required(`${field} is required`)
    .matches(/^\d{6}$/, `${field} must be exactly 6 digits`);

  return optional ? yupObj.notRequired() : yupObj;
};

export const passwordConstraint = (optional: boolean) => {
  const yupObj = yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!.\-#])[A-Za-z\d!.\-#]{8,64}$/,
      "Password must be 8-64 characters and include uppercase, lowercase, number, and special character (! . - #)"
    );

  return optional ? yupObj.notRequired() : yupObj;
};

export const emailConstraint = (optional: boolean) => {
  const yupObj = yup
    .string()
    .email("Email is invalid")
    .required("Email is required");

  return optional ? yupObj.notRequired() : yupObj;
};
