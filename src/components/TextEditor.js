import React from 'react'
import { debounce } from 'utils'
import ReactQuill, { Quill, Mixin, Toolbar } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const toolbarOptions = [
	['link', 'image', 'video'],
	[{ header: [1, 2, 3, false] }],
	['bold', 'italic', 'underline', 'strike'],
	['blockquote'],
	[{ list: 'ordered' }, { list: 'bullet' }],
	[{ color: [] }, { background: [] }],
	[{ align: [] }]
]
const formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'align',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'background',
	'color',
	'link',
	'image',
	'video',
	'width'
]

const modules = {
	toolbar: {
		container: toolbarOptions
	}
}

const TextEditor = ({ value, placeholder, onChange, ...rest }) => {
	return (
		<ReactQuill
			{...rest}
			placeholder={placeholder}
			defaultValue={value || ''}
			onChange={(content, delta, source, editor) => onChange && debounce(onChange(editor.getHTML()), 500)}
			theme="snow"
			modules={modules}
			formats={formats}
		></ReactQuill>
	)
}

export default TextEditor
