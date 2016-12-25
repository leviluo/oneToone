import { sqlStr } from '../dbHelps/mysql'

const publicController = {
    catelogues:async function(next){
        var result = await sqlStr("select specialities.name as childCatelogue,specialityCategory.name as parentCatelogue from specialities left join specialityCategory on specialityCategory.id = specialities.categoryId")
        this.body = {status:'success',data:result}
    }
}
export default publicController;
