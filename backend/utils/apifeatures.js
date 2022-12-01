class apiFeatures{
    constructor(queryParameter , queryStrParameter){
        this.queryProperty = queryParameter
        this.queryStr = queryStrParameter
    }

    search(){

        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword ,
                $options : "i"
            }
        } : {}

        this.queryProperty = this.queryProperty.find({...keyword})
        return this
    }

    filter(){
        // yahan per humen url query mil rhi he.
        const querycopy = {...this.queryStr};

        // filter for category : yahan hum keh rhe hein k url query me se keyword , page , or limit ki quries ko khatem ker do , us k ilawa url mein jo bhi query ho jese category , price , rating wo rakh lo
        const removefields = ['keyword' , 'limit' , 'page']

        removefields.forEach((key) => delete querycopy[key])
        
        // filter for price and rating 
                //yahan hum keh rhe hein k jo bhi query mil rhi he use string me convert ker k "gt , gte , lt , lte" k sath $ ka sign laga do or phir se use object me convert ker do 
        let queryCopyString = JSON.stringify(querycopy)
        queryCopyString = queryCopyString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

                // ab jo object bana he , wo humen findout ker do  
        this.queryProperty = this.queryProperty.find(JSON.parse(queryCopyString))

        return this;

    }

    pagination(resultperpage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultperpage * (currentPage - 1);

        this.queryProperty = this.queryProperty.limit(resultperpage).skip(skip);

        return this;
    }
}

module.exports = apiFeatures