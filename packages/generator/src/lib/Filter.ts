import {
  ClientFilterOperator,
  FieldFilterOperator,
  FieldValidationOperator,
  FilterOperator,
} from "@directus/types";
import { z } from "zod";

import type { ZodType } from "zod";

const FilterOperator: ZodType<FilterOperator> = z.enum([
  `eq`,
  `neq`,
  `lt`,
  `lte`,
  `gt`,
  `gte`,
  `in`,
  `nin`,
  `null`,
  `nnull`,
  `contains`,
  `ncontains`,
  `icontains`,
  `between`,
  `nbetween`,
  `empty`,
  `nempty`,
  `intersects`,
  `nintersects`,
  `intersects_bbox`,
  `nintersects_bbox`,
]);

const ClientFilterOperator: ZodType<ClientFilterOperator> = FilterOperator.or(
  z.enum([
    `starts_with`,
    `nstarts_with`,
    `istarts_with`,
    `nistarts_with`,
    `ends_with`,
    `nends_with`,
    `iends_with`,
    `niends_with`,
    `regex`,
  ]),
);

const Filter = z.lazy(() => z.union([LogicalFilter, FieldFilter]));

const FieldFilterOperator: ZodType<FieldFilterOperator> = z
  .object({
    _between: z.array(z.union([z.string(), z.number()])).optional(),
    _contains: z.string().optional(),
    _empty: z.boolean().optional(),
    _ends_with: z.string().optional(),
    _eq: z.union([z.string(), z.number(), z.boolean()]).optional(),
    _gt: z.union([z.string(), z.number()]).optional(),
    _gte: z.union([z.string(), z.number()]).optional(),
    _icontains: z.string().optional(),
    _iends_with: z.string().optional(),
    _in: z.array(z.union([z.string(), z.number()])).optional(),
    _intersects: z.string().optional(),
    _intersects_bbox: z.string().optional(),
    _istarts_with: z.string().optional(),
    _lt: z.union([z.string(), z.number()]).optional(),
    _lte: z.union([z.string(), z.number()]).optional(),
    _nbetween: z.array(z.union([z.string(), z.number()])).optional(),
    _ncontains: z.string().optional(),
    _nempty: z.boolean().optional(),
    _nends_with: z.string().optional(),
    _neq: z.union([z.string(), z.number(), z.boolean()]).optional(),
    _niends_with: z.string().optional(),
    _nin: z.array(z.union([z.string(), z.number()])).optional(),
    _nintersects: z.string().optional(),
    _nintersects_bbox: z.string().optional(),
    _nistarts_with: z.string().optional(),
    _nnull: z.boolean().optional(),
    _nstarts_with: z.string().optional(),
    _null: z.boolean().optional(),
    _starts_with: z.string().optional(),
  })
  .strict();

type Filter = LogicalFilter | FieldFilter;

type LogicalFilterOr = {
  _or: Filter[];
};

type LogicalFilterAnd = {
  _and: Filter[];
};

type LogicalFilter = LogicalFilterOr | LogicalFilterAnd;

type FieldFilter = FieldFilterOperator | FieldValidationOperator;

const LogicalFilterOr: ZodType<LogicalFilterOr> = z.lazy(() =>
  z
    .object({
      _or: z.array(Filter),
    })
    .strict(),
);

const LogicalFilterAnd: ZodType<LogicalFilterAnd> = z.lazy(() =>
  z
    .object({
      _and: z.array(Filter),
    })
    .strict(),
);

const LogicalFilter: ZodType<LogicalFilter> = z.lazy(() =>
  z.union([LogicalFilterOr, LogicalFilterAnd]),
);

const FieldFilter: ZodType<FieldFilter> = z.lazy(() =>
  z.union([FieldFilterOperator, FieldValidationOperator, FieldFilter]),
);

const FieldValidationOperator: ZodType<FieldValidationOperator> = z
  .object({
    _regex: z.string().optional(),
    _submitted: z.boolean().optional(),
  })
  .strict();

const FilterDictionary = z.record(
  z.object({
    filter: Filter,
    message: z.string(),
  }),
);
type FilterDictionary = z.infer<typeof FilterDictionary>;

export { FieldFilter, Filter, FilterDictionary };
