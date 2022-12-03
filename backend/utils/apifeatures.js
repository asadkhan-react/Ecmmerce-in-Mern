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
        const querycopy = {...this.queryStr};

        const removefields = ['keyword' , 'limit' , 'page']

        removefields.forEach((key) => delete querycopy[key])
        
        let queryCopyString = JSON.stringify(querycopy)
        queryCopyString = queryCopyString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

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