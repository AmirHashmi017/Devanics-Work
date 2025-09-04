"use client"

import { useState } from "react"
import * as Yup from "yup"
import { Spin } from "antd"
import { useFormik } from "formik"
import Dragger from "antd/es/upload/Dragger"

// module imports
import { TemplateBody } from "./TemplateBody"
import CustomButton from "../CustomButton"
import { TextAreaComponent } from "../TextAreaComponent"
import { InputComponent } from "../InputComponent"
import { ShowFileComponent } from "../ShowFileComponent"
import { CloudUploadOutlined } from "@ant-design/icons"

const ValidationSchema = Yup.object().shape({
  to: Yup.string()
    .test({
      message: ({ value }) => {
        const emailAddresses = value.split(",")
        const invalidEmails = emailAddresses.filter((email) => !Yup.string().email().isValidSync(email))
        if (invalidEmails.length > 0) {
          return `Invalid email(s): ${invalidEmails.join(", ")}`
        }
        return true
      },
      test: (value) => {
        if (!value) {
          return true // Allow empty string when the field is not required
        }
        const emailAddresses = value.split(",")
        return emailAddresses.every((email) => Yup.string().email().isValidSync(email))
      },
    })
    .required("Email is required"),
  cc: Yup.string()
    .test({
      message: ({ value }) => {
        const emailAddresses = value.split(",")
        const invalidEmails = emailAddresses.filter((email) => !Yup.string().email().isValidSync(email))
        if (invalidEmails.length > 0) {
          return `Invalid email(s): ${invalidEmails.join(", ")}`
        }
        return true
      },
      test: (value) => {
        if (!value) {
          return true // Allow empty string when the field is not required
        }
        const emailAddresses = value.split(",")
        return emailAddresses.every((email) => Yup.string().email().isValidSync(email))
      },
    })
    .optional(),
  subject: Yup.string().required("Subject is required"),
  description: Yup.string().required("Description can't be empty"),
  file: Yup.mixed(),
})

const CustomEmailTemplate = ({
  invite,
  to,
  setEmailModal,
  submitHandler,
  isFileUploadShow = true,
  isSubmitting = false,
  shouldUpdateTo = false,
  cc = true,
}) => {
  const [isFileUploading] = useState(false)

  const sendEmailFormik = useFormik({
    initialValues: {
      to: "",
      cc: "",
      subject: "",
      description: "",
      file: undefined,
    },
    async onSubmit(values, helpers) {
      try {
        const formData = new FormData()
        formData.append("to", values.to)
        if (invite) {
          formData.append("invite", "1")
        }
        formData.append("cc", values.cc ?? "")
        formData.append("description", values.description ?? "")
        formData.append("subject", values.subject)
        formData.append("file", values.file)
        submitHandler(formData)
      } catch (error) {
        const err = error
      } finally {
        helpers.resetForm()
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: true,
  })

  async function handleFileUpload(file) {
    sendEmailFormik.setFieldValue("file", file)
  }

  // Get the first error message to display at top
  const getFirstErrorMessage = () => {
    if (sendEmailFormik.touched.to && sendEmailFormik.errors.to) {
      return sendEmailFormik.errors.to
    }
    if (sendEmailFormik.touched.cc && sendEmailFormik.errors.cc) {
      return sendEmailFormik.errors.cc
    }
    if (sendEmailFormik.touched.subject && sendEmailFormik.errors.subject) {
      return sendEmailFormik.errors.subject
    }
    if (sendEmailFormik.touched.description && sendEmailFormik.errors.description) {
      return sendEmailFormik.errors.description
    }
    return null
  }

  const firstError = getFirstErrorMessage()

  return (
    <TemplateBody
      title="Email"
      onClose={() => {
        sendEmailFormik.resetForm()
        setEmailModal(false)
      }}
    >
      <div className="space-y-2">
        {/* Error Message Display at Top */}
       {firstError && <p className="text-red-500 text-sm">{firstError}</p>}
        {/* TO Field */}
        <div className="w-full">
          <div className="flex text-sm w-full items-start">
            <span className="flex !rounded-tl !rounded-bl pt-[10px] pb-[10px] w-[40px] justify-center bg-schestiLightPrimary min-h-[40px] items-center">
              To
            </span>
            <div className="w-full">
              <InputComponent
                label=""
                type="text"
                placeholder="Type an Email with comma separated"
                name="to"
                inputStyle="!mt-0 !rounded-tr !rounded-br !rounded-tl-none !rounded-bl-none !py-2"
                field={{
                  value: sendEmailFormik.values.to,
                  onChange: sendEmailFormik.handleChange,
                  onBlur: sendEmailFormik.handleBlur,
                }}
                hasError={false}
                errorMessage=""
              />
            </div>
          </div>
        </div>

        {/* CC Field */}
        {cc && (
          <div className="w-full">
            <div className="flex text-sm w-full items-start">
              <span className="flex !rounded-tl !rounded-bl pt-[10px] pb-[10px] w-[40px] justify-center bg-schestiLightPrimary min-h-[40px] items-center">
                CC
              </span>
              <div className="w-full">
                <InputComponent
                  label=""
                  type="text"
                  placeholder="Type Comma Separated Email"
                  name="cc"
                  inputStyle="!mt-0 !rounded-tr !rounded-br !rounded-tl-none !rounded-bl-none !py-2"
                  field={{
                    value: sendEmailFormik.values.cc,
                    onChange: sendEmailFormik.handleChange,
                    onBlur: sendEmailFormik.handleBlur,
                  }}
                  hasError={false}
                  errorMessage=""
                />
              </div>
            </div>
          </div>
        )}

        {/* Subject Field */}
        <div className="w-full">
          <div className="flex text-sm w-full items-start">
            <span className="flex !rounded-tl !rounded-bl pt-[10px] pb-[10px] w-[85px] justify-center bg-schestiLightPrimary min-h-[40px] items-center">
              Subject
            </span>
            <div className="w-full">
              <InputComponent
                label=""
                type="text"
                placeholder="Subject"
                name="subject"
                inputStyle="!mt-0 !rounded-tr !rounded-br !rounded-tl-none !rounded-bl-none !py-2"
                field={{
                  value: sendEmailFormik.values.subject,
                  onChange: sendEmailFormik.handleChange,
                  onBlur: sendEmailFormik.handleBlur,
                }}
                hasError={false}
                errorMessage=""
              />
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div>
          <TextAreaComponent
            label="Description"
            name="description"
            placeholder="Description"
            field={{
              rows: 4,
              value: sendEmailFormik.values.description,
              onChange: sendEmailFormik.handleChange,
              onBlur: sendEmailFormik.handleBlur,
            }}
            hasError={false}
            errorMessage=""
          />
        </div>

        {/* File Upload */}
        {isFileUploadShow ? (
          <div>
            {!sendEmailFormik.values.file ? (
              <Spin className="flex flex-start" spinning={isFileUploading}>
                <Dragger
                  className="flex flex-start"
                  name={"file"}
                  accept="image/*,gif,application/pdf"
                  beforeUpload={(file) => {
                    handleFileUpload(file)
                    return false
                  }}
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 1,
                    height: "60px",
                    display: "flex",
                    justifyContent: "start",
                  }}
                  itemRender={() => {
                    return null
                  }}
                >
                  <div className="flex items-center justify-start p-2">
                    <CloudUploadOutlined className="!text-gray-600 mr-2" style={{ fontSize: "20px" }} />
                    <p className="text-sm text-[#98A2B3] m-0">Select a file or drag and drop</p>
                  </div>
                </Dragger>
              </Spin>
            ) : (
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* File type icon */}
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      {sendEmailFormik.values.file.type?.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(sendEmailFormik.values.file)} 
                          alt="preview" 
                          className="w-6 h-6 object-cover rounded"
                        />
                      ) : (
                        <span className="text-xs text-blue-600 font-bold">
                          {sendEmailFormik.values.file.name?.split('.').pop()?.toUpperCase() || 'FILE'}
                        </span>
                      )}
                    </div>
                    {/* File info */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {sendEmailFormik.values.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(sendEmailFormik.values.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => sendEmailFormik.setFieldValue("file", undefined)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <CustomButton text="Send" isLoading={isSubmitting} onClick={sendEmailFormik.handleSubmit} />
      </div>
    </TemplateBody>
  )
}

export default CustomEmailTemplate