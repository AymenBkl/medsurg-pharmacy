import { FormGroup } from '@angular/forms';

// tslint:disable-next-line: prefer-const
let formErrors = {
    description: '',
    price: NaN
};

// tslint:disable-next-line: prefer-const
let validationMessages = {
    description: {
        required: 'Description is required.',
        minlength: 'Description must be at least 4 characters long.',
        maxlength : 'Description must be at most 20 characters long.'
    },
    price: {
        required: 'Price is required.',
    },

};

export function onValueChanged(data: any, categoryForm: FormGroup) {
    console.log(categoryForm);
    if (!categoryForm) { return; }
    const form = categoryForm;
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
