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
    qty: Yup.number()
        .transform((value, originalValue) =>
            originalValue === '' ? undefined : value
        )
        .required("Quantity is required")
        .typeError("Quantity must be a number")
        .integer("Quantity must be a whole number")
        .positive("Quantity must be a positive number"),
});


const VALID_TYPES = [
    "Buy",
    "Sell",
    "Credit Amount",
    "Debit Amount",
    "Breakage",
    "Open Sell",
    "Return-In",
    "Return-Out"
];

export const transactionSchema = Yup.object().shape({
    type: Yup.string()
        .oneOf(VALID_TYPES, "Invalid transaction type")
        .required("Transaction type is required"),

    product: Yup.string().when(["type", "$selectedProducts"], {
        is: (type, selectedProducts) =>
            ["Buy", "Sell", "Open Sell", "Return-In", "Return-Out", "Breakage"].includes(type) &&
            (!selectedProducts || selectedProducts.length === 0),
        then: (schema) => schema.required("Product is required"),
        otherwise: (schema) => schema.notRequired(),
    }),

    quantity: Yup.number()
        .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
        )
        .when(["type", "$selectedProducts"], {
            is: (type, selectedProducts) =>
                ["Buy", "Sell", "Open Sell", "Return-In", "Return-Out", "Breakage"].includes(type) &&
                (!selectedProducts || selectedProducts.length === 0),
            then: (schema) =>
                schema
                    .typeError("Quantity must be a number")
                    .required("Quantity is required")
                    .positive("Quantity must be greater than 0"),
            otherwise: (schema) => schema.notRequired(),
        }),

    price: Yup.mixed().when(["type", "$selectedProducts"], {
        is: (type, selectedProducts) =>
            ["Buy", "Sell", "Open Sell", "Return-In", "Return-Out"].includes(type) &&
            (!selectedProducts || selectedProducts.length === 0),
        then: () =>
            Yup.number()
                .transform((value, originalValue) =>
                    originalValue === "" ? undefined : value
                )
                .required("Price is required")
                .typeError("Price must be a number")
                .positive("Price must be a positive number"),
        otherwise: () => Yup.mixed().notRequired(),
    }),


    amount: Yup.mixed().when("type", {
        is: (val) => ["Credit Amount", "Debit Amount"].includes(val),
        then: () =>
            Yup.number()
                .transform((value, originalValue) => {
                    const parsed = Number(originalValue);
                    return isNaN(parsed) ? undefined : parsed;
                })
                .typeError("Amount must be a number")
                .required("Amount is required")
                .positive("Amount must be a positive number"),
        otherwise: () => Yup.mixed().notRequired(),
    }),
    paid: Yup.boolean().optional(),
    description: Yup.string().nullable(),
});

