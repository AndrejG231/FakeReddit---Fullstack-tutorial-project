import React, { InputHTMLAttributes } from "react";
import { Field, useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  textarea?: boolean;
  label: string;
  placeholder: string;
  name: string;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  let InputType = Input;
  if (props.textarea) {
    InputType = Textarea;
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <InputType
        {...field}
        type={props.type}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
