/*global kakao */
import React, { useEffect } from 'react'

export default function Map(props) {
	const { marker, defaultZoom } = props

	useEffect(() => {
		setMarkers()
	}, [marker])

	const setMarkers = () => {
		if (window.kakao && window.kakao.maps) {
			kakao.maps.load(() => {
				let container = document.getElementById('map')
				let options = {
					center: new kakao.maps.LatLng(37.50802, 127.062835),
					level: defaultZoom
				}

				const map = new kakao.maps.Map(container, options)

				if (marker.length < 1) {
					return
				}

				marker.forEach((el) => {
					new kakao.maps.Marker({
						map: map,
						position: new kakao.maps.LatLng(el.lat, el.lng)
					})
				})

				let bounds = new kakao.maps.LatLngBounds()
				for (let i = 0; i < marker.length; i++) {
					bounds.extend(new kakao.maps.LatLng(marker[i].lat, marker[i].lng))
				}
				map.setBounds(bounds)
			})
		}
	}

	return <div id="map" style={{ width: '100%', height: '100%' }}></div>
}
