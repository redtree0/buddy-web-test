import React from 'react'
import RemoveIcon from '../images/removeIcon.png'

const EditImage = ({ data, i, setState }) => {
	const toggle = i === 0
	return (
		<div className={toggle ? 'col-md-12' : 'col-md-6'} key={i}>
			<div
				className="deleteBtn"
				index={i}
				onClick={() =>
					setState((prev) => ({
						...prev,
						filesObj: prev.filesObj.filter((m) => m.id !== data.id),
						imageUrls: prev.imageUrls.filter((m) => m.id !== data.id)
					}))
				}
			>
				<img src={RemoveIcon} className="deleteIcon" alt="" />
				<p className="deleteText">삭제</p>
			</div>
			<img src={data.url} className={`img-rounded img-responsive ${toggle ? 'img_first' : 'img_next'}`} alt="not available" />
			<br />
		</div>
	)
}

export default EditImage
