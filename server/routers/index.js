import publicController from '../controllers/publicController'
import memberController from '../controllers/memberController'
import authController from '../controllers/authController'
import fileController from '../controllers/fileControllers'
// import config from '../../config'

// const paths = config.utils_paths

export default function routers(router){
	router.post("/register",authController.register,router.allowedMethods());
	router.post("/login",authController.login,router.allowedMethods());
	router.get("/auth",authController.auth,router.allowedMethods());
	router.get("/loginOut",authController.loginOut,router.allowedMethods());
	router.get("/public/catelogues",publicController.catelogues,router.allowedMethods());
	router.post("/public/items",publicController.items,router.allowedMethods());
	router.get("/public/Headload",fileController.publicuploadHeadImg,router.allowedMethods());
	router.post("/member/addSpeciality",memberController.addSpeciality,router.allowedMethods());
	router.get("/member/specialities",memberController.specialities,router.allowedMethods());
	router.post("/member/HeadImg",fileController.uploadHeadImg,router.allowedMethods());
	router.get("/member/Headload",fileController.loadHeadImg,router.allowedMethods());
	router.get("/img",fileController.loadImg,router.allowedMethods());  
	router.get("/member/getMemberInfo",memberController.getMemberInfo,router.allowedMethods());
	router.post("/member/messageText",memberController.messageText,router.allowedMethods());
	router.post("/member/historyChat",memberController.updateActive,memberController.historyChat,router.allowedMethods());
	router.post("/member/messageImg",fileController.insertImg,fileController.messageImg,router.allowedMethods());
	router.get("/member/getMessageList",memberController.getMessageList,router.allowedMethods());

	router.post("/member/modifyNickname",memberController.modifyNickname,router.allowedMethods());
	router.post("/member/modifyAddress",memberController.modifyAddress,router.allowedMethods());
	router.post("/member/modifySpeciality",memberController.modifySpeciality,router.allowedMethods());
	router.post("/member/deleteSpeciality",memberController.deleteSpeciality,router.allowedMethods());
	// router.get('*', async function (next){
	// console.log("0000")
	// 	// await next
	//   this.res.sendFile(paths.src('static'))
		// this.res.redirect('/')
	// })
}
