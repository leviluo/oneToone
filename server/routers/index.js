import publicController from '../controllers/publicController'
import memberController from '../controllers/memberController'
import authController from '../controllers/authController'
import fileController from '../controllers/fileControllers'
import organizationController from '../controllers/organizationController'
// import config from '../../config'

// const paths = config.utils_paths

export default function routers(router){
	router.post("/register",authController.register,router.allowedMethods());
	router.post("/login",authController.login,router.allowedMethods());
	router.get("/auth",authController.auth,router.allowedMethods());
	router.get("/loginOut",authController.loginOut,router.allowedMethods());
	router.get("/public/catelogues",publicController.catelogues,router.allowedMethods());
	router.post("/public/items",publicController.items,router.allowedMethods());
	router.get("/public/getCatelogy",publicController.getCatelogy,router.allowedMethods()); //获取类目
	router.get("/public/Headload",fileController.publicuploadHeadImg,router.allowedMethods()); //加载头像
	router.post("/member/addSpeciality",memberController.addSpeciality,fileController.uploadSpecialityImg,router.allowedMethods());
	router.get("/member/specialities",memberController.specialities,router.allowedMethods());
	router.post("/member/HeadImg",fileController.uploadHeadImg,router.allowedMethods()); //上传头像

	router.get("/qrcode",fileController.qrCode,router.allowedMethods());  //获取二维码

	router.get("/img",fileController.loadImg,router.allowedMethods());  
	router.get("/member/getMemberInfo",memberController.getMemberInfo,router.allowedMethods());
	router.post("/member/messageText",memberController.messageText,router.allowedMethods());
	router.post("/member/historyChat",memberController.updateActive,memberController.historyChat,router.allowedMethods());
	router.post("/member/messageImg",fileController.insertImg,fileController.messageImg,router.allowedMethods());
	router.get("/member/getMessageList",memberController.getMessageList,router.allowedMethods());

	router.post("/member/modifyNickname",memberController.modifyNickname,router.allowedMethods());
	router.post("/member/modifyAddress",memberController.modifyAddress,router.allowedMethods());
	router.post("/member/modifySpeciality",memberController.modifySpeciality,fileController.uploadSpecialityImg,router.allowedMethods());
	router.post("/member/deleteSpeciality",memberController.deleteSpeciality,router.allowedMethods());

// 添加新社团
	router.post("/member/addOrganization",organizationController.addOrganization,fileController.uploadOrganizationImg,router.allowedMethods());
// 修改社团信息
	router.post("/member/modifyOrganization",organizationController.modifyOrganization,fileController.uploadOrganizationImg,router.allowedMethods());
// 获取我创建的社团
	router.get("/member/getOrganizationByMe",organizationController.getOrganizationByMe,router.allowedMethods());

	// router.get('*', async function (next){
	// console.log("0000")
	// 	// await next
	//   this.res.sendFile(paths.src('static'))
		// this.res.redirect('/')
	// })
}
