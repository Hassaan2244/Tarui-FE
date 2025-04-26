import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
        .required("Password required")
        .min(6, "Minimum 6 characters"),
});

export const signupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
        .required("Password required")
        .min(6, "Minimum 6 characters"),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match")
});

export const ledgerSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
});

export const productSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
        .transform((value, originalValue) =>
            originalValue === '' ? undefined : value
        )
        .required("Price is required")
        .typeError("Price must be a number")
        .positive("Price must be a positive number"),

    qty: Yup.number()
        .transform((value, originalValue) =>
            originalValue === '' ? undefined : value
        )
        .required("Quantity is required")
        .typeError("Quantity must be a number")
        .integer("Quantity must be a whole number")
        .positive("Quantity must be a positive number"),
});