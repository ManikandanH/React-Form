import React from 'react';
import { Form } from '../components/Form/Form';
import './styles.css';

export default function App() {
	return (
		<div className="App">
			<Form
				onSubmit={(formData) => {
					console.log(formData);
				}}
				formFields={[
					{
						id: 'Email',
						name: 'Email',
						type: 'email',
						required: true,
						label: 'Email',
						placeholder: 'Email',
						value: '',
						onChange: (value: string) => {
							return value;
						},
						customValidation: (e) => {
							return {
								errorMessage: '',
							};
						},
					},
					{
						id: 'Password',
						name: 'Password',
						type: 'password',
						required: true,
						placeholder: 'Password',
						value: '',
					},
					{
						id: 'UserName',
						name: 'UserName',
						type: 'text',
						required: false,
						placeholder: 'UserName',
						value: '',
					},
				]}
			/>
		</div>
	);
}
