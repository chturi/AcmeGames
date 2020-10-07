import { AbstractControl, ValidationErrors } from "@angular/forms"

//Password strength validation for forms.
export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

    let value: string = control.value || '';

    if (!value) {
        return null
    }

    let upperCaseCharacters = /[A-Z]+/g;
    let lowerCaseCharacters = /[a-z]+/g;
    let numberCharacters = /[0-9]+/g;
    let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (upperCaseCharacters.test(value) === false || lowerCaseCharacters.test(value) === false || numberCharacters.test(value) === false || specialCharacters.test(value) === false) {
        return {
            passwordStrength: 'A New password must contain at least two of the following: numbers, lowercase letters, uppercase letters, or special characters.'
        }

    }
}