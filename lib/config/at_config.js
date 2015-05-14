// Account Options
AccountsTemplates.configure({
    defaultLayout: 'layout',
    showForgotPasswordLink: true,
    overrideLoginErrors: false,
    enablePasswordChange: true,
    sendVerificationEmail: false,
    forbidClientAccountCreation: true,
    showPlaceholders: true,
    negativeValidation: true,
    positiveValidation:false,
    negativeFeedback: true,
    positiveFeedback:true,
});

//Routes
AccountsTemplates.configureRoute('signIn', {
    redirect: '/admin/settings'
});
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('resetPwd');
