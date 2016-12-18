import publicController from '../controllers/publicController'
import fileController from '../controllers/fileControllers'

export default function routers(router){
	router.post("/register",publicController.register,router.allowedMethods());
	router.post("/login",publicController.login,router.allowedMethods());
	router.get("/auth",publicController.auth,router.allowedMethods());
	router.get("/loginOut",publicController.loginOut,router.allowedMethods());
	//文件下载
	router.get('/download',fileController.fileDownload,router.allowedMethods());
	//图片请求
	router.get('/images',fileController.imageQuery,router.allowedMethods());
}
