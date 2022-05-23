import { useState } from 'react'

function SortBtn({ sort, title, orderClick }) {
	const [toggle, setToggle] = useState(undefined)
	const handleClick = () => {
		setToggle(!toggle)
		orderClick()
	}
	return (
		<div style={{ cursor: 'pointer' }} onClick={handleClick}>
			{title}
			{toggle !== undefined && sort.align ? (
				<span className={`order ${toggle ? 'dropup' : ''}`}>
					<span className="caret" style={{ margin: '10px 5px' }}></span>
				</span>
			) : (
				<span className="order">
					<span className="dropdown">
						<span className="caret" style={{ margin: '10px 0px 10px 5px', color: 'rgb(204, 204, 204)' }}></span>
					</span>
					<span className="dropup">
						<span className="caret" style={{ margin: '10px 0px', color: 'rgb(204, 204, 204)' }}></span>
					</span>
				</span>
			)}
		</div>
	)
}
export default SortBtn
