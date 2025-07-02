import React from "react";
import ReactQuill from "react-quill";
import { quillFormats, quillModules } from "../../constants";

import { DescriptionError } from "./style";

const CustomQuillEditor = ({ formik }) => {
  return (
    <div>
      <ReactQuill
        value={formik.values.description || ""}
        onChange={(value) => formik.setFieldValue("description", value)}
        formats={quillFormats}
        modules={quillModules}
        placeholder="Enter description"
      />
      {formik.touched.description && formik.errors.description && (
        <DescriptionError>{formik.errors.description}</DescriptionError>
      )}
    </div>
  );
};

export default CustomQuillEditor;
