import React, { Fragment, useState } from 'react';
import { FormFields, FormSubmitValues } from './types';
import '/styles.css';

interface FormProps {
	formFields: Array<FormFields>;
	onSubmit: (formValues: FormSubmitValues) => void;
	submitButtonClass?: string;
}

interface FormFieldState extends FormFields {
	isError: boolean;
	errorMessages: Array<string>;
	uniqueId?: string;
}

function mergeFormFieldPropsToState(formFields: Array<FormFields>): Array<FormFieldState> {
	return formFields.map((field) => ({
		...field,
		uniqueId: (Math.floor(Math.random() * 10000) + 10000).toString().substring(1),
		required: field.required || false,
		placeholder: field.placeholder || field.name,
		isError: false,
		errorMessages: [],
	}));
}

export function Form({
	formFields,
	submitButtonClass = '',
	onSubmit = () => {},
}: FormProps): React.ReactElement {
	const [form, setForm] = useState<Array<FormFieldState>>(mergeFormFieldPropsToState(formFields));

	const errorFinder = (
		customValidationError: string,
		required: boolean,
		value: string
	): { isError: boolean; errorMessages: Array<string> } => {
		if (customValidationError) {
			return {
				isError: true,
				errorMessages: [customValidationError],
			};
		} else if (required && value.length === 0) {
			if (customValidationError) {
				return {
					isError: true,
					errorMessages: [customValidationError],
				};
			}
			return {
				isError: true,
				errorMessages: ['This Field is Required'],
			};
		}
		return {
			isError: false,
			errorMessages: [],
		};
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>, fields: FormFieldState) => {
		setForm((prevState) => {
			return prevState.map((form) => {
				if (form.uniqueId === fields.uniqueId) {
					const value =
						(fields.onChange && fields.onChange(e.target.value)) || e.target.value;
					const { errorMessage: customValidationErr } = (fields.customValidation &&
						fields.customValidation(e)) || {
						errorMessage: '',
					};
					const { isError, errorMessages } = errorFinder(
						customValidationErr,
						fields.required || false,
						value
					);

					return {
						...form,
						isError,
						errorMessages,
					};
				}

				return form;
			});
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, fields: FormFieldState) => {
		const value = (fields.onChange && fields.onChange(e.target.value)) || e.target.value;
		const { errorMessage: customValidationErr } = (fields.customValidation &&
			fields.customValidation(e)) || { errorMessage: '' };
		const { isError, errorMessages } = errorFinder(
			customValidationErr,
			fields.required || false,
			value
		);

		setForm((prevState) =>
			prevState.map((form) => {
				if (form.uniqueId === fields.uniqueId) {
					console.log(value);
					return {
						...form,
						value,
						isError,
						errorMessages,
					};
				}
				return form;
			})
		);
	};

	const attachClassNameToInput = (fields: FormFieldState): string => {
		if (fields.isError && fields.inputClass) {
			return `input-class-error ${fields.inputClass}`;
		} else if (fields.isError) {
			return `input-class input-class-error`;
		}
		return 'input-class';
	};

	const renderFormFields = (formFields: FormFieldState): React.ReactElement => {
		const { label, customValidation, onChange, isError, errorMessages, uniqueId, ...fields } =
			formFields;

		return formFields.label ? (
			<Fragment key={uniqueId}>
				<label>{formFields.label}</label>
				<input
					className={attachClassNameToInput(formFields)}
					{...fields}
					onBlur={(e) => handleBlur(e, formFields)}
					onChange={(e) => handleChange(e, formFields)}
				/>
				{isError && (
					<p className={fields.errorClass || 'error-class'}>
						{errorMessages.join(', ').trim()}
					</p>
				)}
			</Fragment>
		) : (
			<Fragment key={uniqueId}>
				<input
					className={attachClassNameToInput(formFields)}
					{...fields}
					onBlur={(e) => handleBlur(e, formFields)}
					onChange={(e) => handleChange(e, formFields)}
				/>
				{isError && (
					<p className={fields.errorClass || 'error-class'}>
						{errorMessages.join(', ').trim()}
					</p>
				)}
			</Fragment>
		);
	};

	return (
		<div className="form-wrapper">
			{form.map((formField) => renderFormFields(formField))}
			<button className={submitButtonClass || 'submit-button'}>Submit</button>
		</div>
	);
}
