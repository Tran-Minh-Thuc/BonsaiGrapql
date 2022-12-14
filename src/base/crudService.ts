import _ from "lodash";
import { Model } from "mongoose";
import { BaseService } from "./baseService";

export type QueryInput = {
  limit?: number;
  page?: number;
  filter?: any;
  order?: any;
  search?: string;
};

export class CrudService<T> extends BaseService {
  constructor(public model: Model<T>) {
    super();
  }
  async fetch(queryInput: QueryInput = {}, select?: string) {
    const limit = queryInput.limit || 10;
    const skip = ((queryInput.page || 1) - 1) * limit || 0;
    const order = queryInput.order;
    const search = queryInput.search;
    const model = this.model;
    const query = model.find();

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
    if (select) {
      query.select(select);
    }
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
}
