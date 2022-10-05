import { QueryInput } from "../../base/crudService";
import _ from "lodash";


export default async function getDataWithPagination(queryInput: QueryInput = {}, model: any) {
    const limit = queryInput.limit || 10;
    const skip = ((queryInput.page || 1) - 1) * limit || 0;
    const order = queryInput.order;
    const search = queryInput.search;


    const query = model.find();
    if(query == null){
        return null;
    }

    if (search) {
        if (search.includes(" ")) {
            _.set(queryInput, "filter.$text.$search", search);
            query.select({ _score: { $meta: "textScore" } });
            query.sort({ _score: { $meta: "textScore" } });

        } else {
            const textSearchIndex = model.schema
                .indexes()
                .filter((c: any) => _.values(c[0]!).some((d: any) => d == "text"));
            if (textSearchIndex.length > 0) {
                const or: any[] = [];
                textSearchIndex.forEach((index) => {
                    Object.keys(index[0]!).forEach((key) => {
                        or.push({ [key]: { $regex: search, $options: "i" } });
                    });
                });
                _.set(queryInput, "filter.$or", or);
            }

        }

    }

    if (order) {
        query.sort(order);
    }
    if (queryInput.filter) {
        const filter = JSON.parse(
            JSON.stringify(queryInput.filter).replace(
                /\"(\_\_)(\w+)\"\:/g,
                `"$$$2":`
            )
        );
        query.setQuery({ ...filter });
    }
    const countQuery = model.find().merge(query);
    query.limit(limit);
    query.skip(skip);

    return await Promise.all([
        query.exec().then((res) => {
            // console.timeEnd("Fetch");
            return res;
        }),
        countQuery.count().then((res) => {
            // console.timeEnd("Count");
            return res;
        }),
    ]).then((res) => {
        return {
            data: res[0],
            pagination: {
                page: queryInput.page || 1,
                limit: limit,
                total: res[1],
            },
        };
    });
}


export async function getDataPaginationWithQuery(queryInput: QueryInput = {}, query: any,model:any) {
    const limit = queryInput.limit || 10;
    const skip = ((queryInput.page || 1) - 1) * limit || 0;
    const order = queryInput.order;
    const search = queryInput.search;

    if (search) {
        if (search.includes(" ")) {
            _.set(queryInput, "filter.$text.$search", search);
            query.select({ _score: { $meta: "textScore" } });
            query.sort({ _score: { $meta: "textScore" } });

        } else {
            const textSearchIndex = model.schema
                .indexes()
                .filter((c: any) => _.values(c[0]!).some((d: any) => d == "text"));
            if (textSearchIndex.length > 0) {
                const or: any[] = [];
                textSearchIndex.forEach((index) => {
                    Object.keys(index[0]!).forEach((key) => {
                        or.push({ [key]: { $regex: search, $options: "i" } });
                    });
                });
                _.set(queryInput, "filter.$or", or);
            }

        }

    }

    if (order) {
        query.sort(order);
    }
    if (queryInput.filter) {
        const filter = JSON.parse(
            JSON.stringify(queryInput.filter).replace(
                /\"(\_\_)(\w+)\"\:/g,
                `"$$$2":`
            )
        );
        query.setQuery({ ...filter });
    }
    const countQuery = model.find().merge(query);
    query.limit(limit);
    query.skip(skip);

    return await Promise.all([
        query.exec().then((res) => {
            // console.timeEnd("Fetch");
            return res;
        }),
        countQuery.count().then((res) => {
            // console.timeEnd("Count");
            return res;
        }),
    ]).then((res) => {
        return {
            data: res[0],
            pagination: {
                page: queryInput.page || 1,
                limit: limit,
                total: res[1],
            },
        };
    });
}