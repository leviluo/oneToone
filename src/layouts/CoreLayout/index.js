import CoreLayout from './CoreLayout'
import { injectReducer } from '../../store/reducers'

export default function MyCoreLayout(store){
	//为什么要必须命名为reducer
	var reducer = require('../../components/Tips/modules/tips').default  
	injectReducer(store, { key: 'mytips', reducer })
	reducer = require('../../components/Modal/modules/modal').default  
	injectReducer(store, { key: 'modal', reducer })
	reducer = require('../../components/Location/modules/location').default  
	injectReducer(store, { key: 'mylocation', reducer })
	reducer = require('../../components/Header/modules/auth').default  
	injectReducer(store, { key: 'auth', reducer })
	return CoreLayout
}

