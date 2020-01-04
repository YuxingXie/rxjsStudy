import {Kindergarten} from "./Kindergarten";
import {Mummy} from "./Mummy";

const wanyingYoueryuan = new Kindergarten();

const mummy = new Mummy();

wanyingYoueryuan.careBaby(mummy);

/**
findCurrentTermSchoolFeeOrder(studentId: string): Observable<ResponseData<Order>> {
    return this.http.get<ResponseData<Order>>(environment.url + '/api/order/current_term_school_fee/' + studentId);
}
 */
/**
this.orderService.findByStudentId(this.studentId, this.orderPage.number + 1).subscribe(response => {
    if (response.success) {
        this.orderPage = response.data;
        this.orders.concat(response.data.content);
    }
});
}
*/
