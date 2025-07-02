import React from "react";
import ReactQuill from "react-quill";
import { quillFormats, quillModules } from "../../constants";

const QuillEditor = ({ value = "", onChange }) => {
  return (
    <div>
      <ReactQuill
        value={value}
        onChange={(value) => onChange(value)}
        formats={quillFormats}
        modules={quillModules}
        placeholder="Enter description"
      />
    </div>
  );
};

export default QuillEditor;
