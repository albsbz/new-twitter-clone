"use client";

import React from "react";
import z from "zod";
import IFormField from "./types/IFormField";
import FormInput from "./FormInput";

function Form({
  handleSubmit,
  fields,
  submitButtonText = "Submit",
  validateSchema,
}: {
  handleSubmit: (
    e: React.SubmitEvent<HTMLFormElement>,
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => void;
  submitButtonText?: string;
  fields: IFormField[];
  validateSchema: { [key: string]: z.ZodTypeAny };
}) {
  const [formErrors, setFormErrors] = React.useState<{ [key: string]: string }>(
    {},
  );
  const validate = (formData: { [key: string]: any }) => {
    const validatedData = z.object(validateSchema).safeParse(formData);
    if (!validatedData.success) {
      const errors: { [key: string]: string } = {};
      validatedData.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string;
        errors[fieldName] = err.message;
      });
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };
  const validateAndSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    if (!validate(formData)) {
      return;
    }
    handleSubmit(e, (responseErrors) => {
      if (!responseErrors) {
        setFormErrors({});
        return;
      }
      const errors: { [key: string]: string } = {};

      if (typeof responseErrors === "string") {
        JSON.parse(responseErrors).forEach((err: any) => {
          const fieldName = err.path[0] as string;
          errors[fieldName] = err.message;
        });
        setFormErrors(errors);
      }
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={validateAndSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="mb-1 font-semibold">
            {field.title}
          </label>
          <FormInput type={field.type} field={field} />

          <span className="text-red-500 text-sm mt-1">
            {formErrors[field.name]}
          </span>
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        {submitButtonText}
      </button>
    </form>
  );
}

export default Form;
