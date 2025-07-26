import * as Yup from "yup";

export const TOKEN = "token";

export const USER = "user";

// Login initial values
export const loginInitialValues = {
  email: "",
  password: "",
};

// Forgot password initial values
export const forgotInitialValues = {
  email: "",
};

// Forgot password initial values
export const resetPasswordInitialValues = {
  password: "",
  confirmPassword: "",
};

// Options for status
export const statusOptions = ["Active", "Inactive"];

// Quill formats
export const quillFormats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "code-block",
  "align",
  "direction",
  "script",
];

// Quill modules
export const quillModules = {
  toolbar: [
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "bullet" }, { list: "ordered" }],
    [{ align: [] }],
    [{ direction: "rtl" }],
    [{ script: "sub" }, { script: "super" }],
    ["clean"],
    ["code-block"],
  ],
};

// Add blog initialvalues
export const blogInitialValues = {
  title: "",
  description: "",
  file: [],
};

// Add blog form elements
export const addBlogFormElements = [
  { type: "text", name: "title", label: "Enter title" },
  { type: "quill", name: "description" },
  { type: "dropzone", inputType: "image", name: "file" },
];

// Add blog initialvalues
export const bookInitialValues = {
  title: "",
  file: [],
};

// Add blog form elements
export const addBookFormElements = [
  { type: "text", name: "title", label: "Enter title" },
  { type: "dropzone", inputType: "pdf", name: "file" },
];

// Add clip initialvalues
export const clipInitialValues = {
  thumbnail: [],
  title: "",
  description: "",
  video: [],
};

// Add clip form elements
export const addClipFormElements = [
  { type: "dropzone", inputType: "video", name: "video" },
  { type: "text", name: "title", label: "Enter title" },
  { type: "quill", name: "description" },
  { type: "dropzone", inputType: "image", name: "thumbnail" },
];

// Add library form elements
export const addLibraryFormElements = [
  { type: "text", name: "title", label: "Enter title" },
  { type: "autocomplete", name: "type", label: "Type" },
  { type: "quill", name: "description" },
];

export const libraryInitialValues = {
  title: "",
  description: "",
  type: "",
};

// Options from A to Z
export const typeOptions = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);

// Add whistle initial values
export const whistleInitialValues  = {
  description: "",
  // date: null,
};
export const whistleValidationSchema = Yup.object({
  description: Yup.string().required("Description is required"),
});

// ✅ Correct way
export const createNewWhistle = (req) => ({
  description: req.body.description,
  date: new Date(),
});

// Add whistle form elements
// export const addWhistleFormElements = [
//   { type: "date", name: "date", label: "Date" },
//   { type: "quill", name: "description" },
// ];

export const addWhistleFormElements = [
  {
    type: "quill",
    name: "description",
    label: "Description",
  },
  // ❌ remove the `type: "date"` field
];



// Blue print initial values
export const bluePrintInitialValues = {
  title: "",
  description: "",
  file: [],
};

// Blue print form elements
export const addBluePrintFormElements = [
  { type: "text", name: "title", label: "Title" },
  { type: "quill", name: "description" },
  { type: "dropzone", inputType: "pdf", name: "file" },
];

// Add blog initialvalues
export const loungeInitialValues = {
  category: "",
  color: "",
  status: "",
  file: [],
};

export const loungeFileElement = {
  inputType: "smallFile",
  fieldName: "file",
};
