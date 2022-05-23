import MobileDetect from 'mobile-detect'
import React, { useEffect, useState } from 'react'
import axios from '../../wrapper/axios'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './userlist.theme.style'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import AddEventDialog from './addEventDialog'
import DetailDialog from './detailDialog'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import withNavigation from 'components/withNavigation'
import scss from './userlist.module.scss'
import { alertMessage } from 'containers/studyroom/utils/roomUtils'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'

import { getUsers } from './utils/query'

const md = new MobileDetect(window.navigator.userAgent)
const options = {
	defaultSortName: 'seq', // default sort column name
	// defaultSortOrder: 'desc', // default sort order
	// clearSearch: true,
	// clearSearchBtn: this.createCustomClearButton,
	// sizePerPageDropDown: this.renderSizePerPageDropDown,
	// insertBtn: this.createCustomInsertButton,
	noDataText: '데이터 없음'
}

const UserList = ({ match, location, staticContext }) => {
	const navigate = useNavigate()
	const [page, setPage] = useState(1)
	const [state, setState] = useState({
		users: [],
		newData: null,
		userInfo: null,
		activePage: 1,
		listTotal: 0,
		sizePerPage: 10,
		searchValue: '',
		searchData: '',
		defaultOrder: 'seq',
		order: 'desc'
	})
	const [search, setSearch] = useState(null)
	const { data, isError, isLoading } = useQuery(['admin/users', { state, search, page }], getUsers, {
		keepPreviousData: true,
		staleTime: 600
	})

	const changePage = () => {
		setPage((prev) => prev + 1)
	}
	if (parseInt(sessionStorage.getItem('manager_seq'), 10) !== 1) {
		return navigate(-1)
	}
	return <button onClick={() => changePage()}>NEXT</button>
}

export default withNavigation(UserList)
