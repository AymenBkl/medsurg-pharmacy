import { FormGroup } from '@angular/forms';

// tslint:disable-next-line: prefer-const
let formErrors = {
    firstname: '',
    lastname: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
};

// tslint:disable-next-line: prefer-const
let validationMessages = {

    firstname: {
        required: 'Firstname is required.',
        minlength: 'Firstname must be at least 4 characters long.',
        maxlength : 'Firstname must be at most 20 characters long.'
    },
    lastname: {
        required: 'Lastname is required.',
        minlength: 'Lastname must be at least 4 characters long.',
        maxlength : 'Lastname must be at most 20 characters long.'
    },
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

export function onValueChanged(data: any, registerForm: FormGroup) {
    console.log(registerForm);
    if (!registerForm) { return; }
    const form = registerForm;
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
