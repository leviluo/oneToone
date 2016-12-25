import publicController from '../controllers/publicController'
import memberController from '../controllers/memberController'
import authController from '../controllers/authController'
import fileController from '../controllers/fileControllers'

export default function routers(router){
	router.post("/register",authController.register,router.allowedMethods());
	router.post("/login",authController.login,router.allowedMethods());
	router.get("/auth",authController.auth,router.allowedMethods());
	router.get("/loginOut",authController.loginOut,router.allowedMethods());
	router.get("/public/catelogues",publicController.catelogues,router.allowedMethods());
	router.post("/member/addSpeciality",memberController.addSpeciality,router.allowedMethods());
	router.get("/member/specialities",memberController.specialities,router.allowedMethods());
	//文件下载
	router.get('/download',fileController.fileDownload,router.allowedMethods());
	//图片请求
	router.get('/images',fileController.imageQuery,router.allowedMethods());
}
