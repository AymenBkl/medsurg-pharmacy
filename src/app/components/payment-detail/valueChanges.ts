import { FormGroup } from '@angular/forms';

// tslint:disable-next-line: prefer-const
let formErrors = {
    bankAccountNumber: '',
    IFSCCODE: '',
    ACCOUNTHOLDERNAME: '',
};

// tslint:disable-next-line: prefer-const
let validationMessages = {
    bankAccountNumber: {
        required: 'Bank Account Number is required.',
        minlength: 'Bank Account Number must be at least 4 characters long.',
    },
    IFSCCODE: {
        required: 'IFSCCODE is required.',
        minlength: 'IFSCCODE must be at least 4 characters long.',
    },
    ACCOUNTHOLDERNAME: {
        required: 'ACCOUNT HOLDER NAME is required.',
        minlength: 'ACCOUNTHOLDER NAME must be at least 4 characters long.',
    },

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
