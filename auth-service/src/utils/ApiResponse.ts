export class ApiResponse<T=unknown>{
    sucess:boolean;
    data:T|null;
    message:string;
    constructor(sucess:boolean,data:T|null,message:string){
        this.sucess=sucess;
        this.data=data;
        this.message=message
    }

}