export interface CustomValidationErrorMessage {
	errorMessage: string;
}

export interface FormSubmitValues {
	[key: string]: {
		value: string;
	};
}

export type InputTypes = 'text' | 'password' | 'email';

export interface FormFields {
	type: InputTypes;
	id: string;
	value: string;
	name: string;
	label?: string;
	required?: boolean;
	placeholder?: string;
	inputClass?: string;
	errorClass?: string;
	onChange?: (event: string) => string;
	customValidation?: (event: React.ChangeEvent<HTMLInputElement>) => CustomValidationErrorMessage;
}
