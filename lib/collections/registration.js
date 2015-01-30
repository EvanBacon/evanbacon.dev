// for registration form
registrationSchema = new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail address"
    },
    password: {
        type: String,
        label: "Password",
        max: 15,
        min: 6,
        regEx: /[a-z0-9]/i, 
    },
});