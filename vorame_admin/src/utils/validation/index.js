import * as yup from "yup";

const loginValidation = {
  email: "Email is required",
  password: "Password is required",
  validEmail: "Provide is a valid email",
};

const resetPasswordValidation = {
  password: "Password is required",
  confirmPassword: "Confirm password is required",
  passwordLength: "Password must be longer than or equal to 6 characters",
};

const blogValidation = {
  title: "Title is required",
  description: "Description is required",
  file: "Image is required",
  url: "File url is required",
  type: "File type is required",
  name: "File name is required",
  extension: "File extension is required",
};

const loungeValidation = {
  category: "Category is required",
  color: "Clor is required",
  status: "Status is required",
  file: "Image is required",
};

const clipValidation = {
  title: "Title is required",
  description: "Description is required",
  file: "Image is required",
  url: "File url is required",
  type: "File type is required",
  name: "File name is required",
  extension: "File extension is required",
  video: "Video is required",
  thumbnail: "Thumbanil is required",
};

const libraryValidation = {
  title: "Title is required",
  description: "Description is required",
  type: "Type is required",
};

const whistleValidation = {
  description: "Description is required",
  date: "Date is required",
  dateTypeError: "Provide valid date",
};

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required(loginValidation.email)
    .email(loginValidation.validEmail),
  password: yup.string().required(loginValidation.password),
});

export const forgotValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required(loginValidation.email)
    .email(loginValidation.validEmail),
});

export const resetPasswordValidationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, resetPasswordValidation.passwordLength)
    .required(resetPasswordValidation.password),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Confirm password must match")
    .required(resetPasswordValidation.confirmPassword),
});

export const blogValidationSchema = yup.object().shape({
  title: yup.string().required(blogValidation.title),
  description: yup.string().required(blogValidation.description),
  file: yup
    .array()
    .min(1, blogValidation.file)
    .of(
      yup.object().shape({
        url: yup.string().required(blogValidation.url),
        type: yup.string().required(blogValidation.type),
        extension: yup.string().required(blogValidation.extension),
        name: yup.string().required(blogValidation.name),
      }),
    ),
});

export const bookValidationSchema = yup.object().shape({
  title: yup.string().required(blogValidation.title),
  file: yup
    .array()
    .min(1, "File is required")
    .of(
      yup.object().shape({
        url: yup.string().required(blogValidation.url),
        type: yup.string().required(blogValidation.type),
        extension: yup.string().required(blogValidation.extension),
        name: yup.string().required(blogValidation.name),
      }),
    ),
});

export const clipValidationSchema = yup.object().shape({
  title: yup.string().required(clipValidation.title),
  description: yup.string().required(clipValidation.description),
  video: yup
    .array()
    .min(1, clipValidation.video)
    .of(
      yup.object().shape({
        url: yup.string().required(clipValidation.url),
        type: yup.string().required(clipValidation.type),
        extension: yup.string().required(clipValidation.extension),
        name: yup.string().required(clipValidation.name),
      }),
    ),
  thumbnail: yup
    .array()
    .min(1, clipValidation.thumbnail)
    .of(
      yup.object().shape({
        url: yup.string().required(clipValidation.url),
        type: yup.string().required(clipValidation.type),
        extension: yup.string().required(clipValidation.extension),
        name: yup.string().required(clipValidation.name),
      }),
    ),
});

export const libraryValidationSchema = yup.object().shape({
  title: yup.string().required(libraryValidation.title),
  description: yup.string().required(libraryValidation.description),
  type: yup.string().required(libraryValidation.type),
});

export const whistleValidationSchema = yup.object().shape({
  description: yup.string().required(libraryValidation.description),
  date: yup
    .date()
    .typeError(whistleValidation.dateTypeError)
    .required(whistleValidation.date),
});

export const bluePrintValidationSchema = yup.object().shape({
  title: yup.string().required(libraryValidation.description),
  description: yup.string().required(libraryValidation.description),
  file: yup
    .array()
    .min(1, "File is required")
    .of(
      yup.object().shape({
        url: yup.string().required(blogValidation.url),
        type: yup.string().required(blogValidation.type),
        extension: yup.string().required(blogValidation.extension),
        name: yup.string().required(blogValidation.name),
      }),
    ),
});

export const loungeValidationSchema = yup.object().shape({
  category: yup.string().required(loungeValidation.category),
  color: yup.string().required(loungeValidation.color),
  status: yup.string().required(loungeValidation.status),
  file: yup
    .array()
    .min(1, loungeValidation.file)
    .of(
      yup.object().shape({
        url: yup.string().required(blogValidation.url),
        type: yup.string().required(blogValidation.type),
        extension: yup.string().required(blogValidation.extension),
        name: yup.string().required(blogValidation.name),
      }),
    ),
});
