// 검색 api 호출 빈도 줄이기 debounce or throttle
let dtimer = null
const debounce = (fn, ms = 500) => {
	function exec() {
		fn.apply()
	}
	if (dtimer) {
		clearTimeout(dtimer)
	}
	if (typeof fn === 'function' && typeof ms === 'number') {
		dtimer = setTimeout(exec, ms)
	}
}

let ttimer = null
const throttle = (fn, ms) => {
	function exec() {
		ttimer = null
		fn.apply()
	}
	if (!ttimer && typeof fn === 'function' && typeof ms === 'number') {
		ttimer = setTimeout(exec, ms)
	}
}

export { debounce, throttle }
