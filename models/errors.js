var generaterr = require('generaterr');

var AuthenticationError = generaterr('AuthenticationError');

module.exports = {
    AuthenticationError : AuthenticationError,
    IncorrectUsernameError : generaterr('IncorrectUsernameError', null, { inherits : AuthenticationError }),
    IncorrectPasswordError : generaterr('IncorrectPasswordError', null,{ inherits : AuthenticationError }),
    IncorrectOldPasswordError : generaterr('IncorrectOldPasswordError', null,{ inherits : AuthenticationError }),
    PasswordSameError : generaterr('PasswordSameError', null,{ inherits : AuthenticationError }),
    MissingUsernameError : generaterr('MissingUsernameError', null,{ inherits : AuthenticationError }),
    MissingPasswordError : generaterr('MissingPasswordError', null,{ inherits : AuthenticationError }),
    UserExistsError : generaterr('UserExistsError', null,{ inherits : AuthenticationError }),
    UserNotExistsError : generaterr('UserNotExistsError', null,{ inherits : AuthenticationError }),
    MissingEmailError : generaterr('MissingEmailError', null,{ inherits : AuthenticationError }),
    EmailExistsError : generaterr('EmailExistsError', null,{ inherits : AuthenticationError }),
    TempUserNotFoundError : generaterr('TempUserNotFoundError', null,{ inherits : AuthenticationError }),
    NoSaltValueStoredError : generaterr('NoSaltValueStoredError', null,{ inherits : AuthenticationError }),
    AttemptTooSoonError : generaterr('AttemptTooSoonError', null,{ inherits : AuthenticationError }),
    TooManyAttemptsError : generaterr('TooManyAttemptsError', null,{ inherits : AuthenticationError })
};
