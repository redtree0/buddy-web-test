import { TextField } from '@material-ui/core'
import React from 'react'
import { Controller } from 'react-hook-form'
import { InputTitle, InputWrapper } from '../EditInfo.styled'

function TextInput({ title, admin = false, value, control, name, type = 'text', disabled }) {
	return (
		<InputWrapper>
			<InputTitle admin={admin} className="col-md-2">
				{title}
			</InputTitle>
			{control ? (
				<Controller
					name={name}
					control={control}
					defaultValue={value}
					render={({ field: { onChange, value } }) => (
						<TextField
							className="col-md-9 editinfo_tf_2"
							margin="normal"
							type={type}
							onChange={onChange}
							value={value}
							disabled={disabled}
						/>
					)}
				/>
			) : (
				<TextField className="col-md-9 editinfo_tf_2" margin="normal" type={type} value={value} disabled={disabled} />
			)}
		</InputWrapper>
	)
}

export default TextInput
