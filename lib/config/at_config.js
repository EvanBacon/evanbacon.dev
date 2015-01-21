// Options
AccountsTemplates.configure({
    defaultLayout: 'layout',
    showForgotPasswordLink: true,
    overrideLoginErrors: true,
    enablePasswordChange: true,
    sendVerificationEmail: false,
    forbidClientAccountCreation: true,

    //enforceEmailVerification: true,
    //confirmPassword: true,
    //continuousValidation: false,
    //displayFormLabels: true,
    //forbidClientAccountCreation: false,
    //formValidationFeedback: true,
    //homeRoutePath: '/',
    //showAddRemoveServices: false,
    //showPlaceholders: true,

    negativeValidation: true,
    positiveValidation:false,
    negativeFeedback: true,
    positiveFeedback:true,
});

//Routes
AccountsTemplates.configureRoute('signIn', {
    redirect: '/admin/media-manager',
});
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('changePwd');
