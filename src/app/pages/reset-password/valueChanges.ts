import { FormGroup } from '@angular/forms';

// tslint:disable-next-line: prefer-const
let formErrors = {
    phoneNumber: '',
    password: '',
    confirmPassword: ''
};

// tslint:disable-next-line: prefer-const
let validationMessages = {
    phoneNumber: {
        required: 'PhoneNumber is required.',
        minlength: 'PhoneNumber must be at least 10 characters long.',
        maxlength : 'PhoneNumber must be at most 10 characters long.'
    },
    password : {
        required: 'Password is required.',
        minlength: 'Password must be at least 6 characters long.',
        mustMatch : 'Password are not matching'
    },
    confirmPassword : {
        required: 'Password is required.',
        minlength: 'Password must be at least 6 characters long.',
        mustMatch : 'Password are not matching'
    }

};

export function onValueChanged(data: any, loginForm: FormGroup) {
    console.log(loginForm);
    if (!loginForm) { return; }
    const form = loginForm;
    for (const field in formErrors) {
        if (formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = validationMessages[field];
                for (const key in control.errors) {
                    if (control.errors.hasOwnProperty(key)) {
                        formErrors[field] += messages[key] + ' ';
                    }
                }
            }
        }
    }
    return formErrors;
}
