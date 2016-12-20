import { sqlStr } from '../dbHelps/mysql'

const publicController = {
    categoies:async function(next){

        var result = await sqlStr("select specialities.name as childName,specialityCategory.name as parentName from specialities left join specialityCategory on specialityCategory.id = specialities.categoryId")
        this.body = result
    }
}
export default publicController;
