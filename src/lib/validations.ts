import { z } from "zod";

export const preorderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  products: z.number().int().positive("Products must be at least 1"),
  preorderWhen: z.string().default("regardless-of-stock"),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }).optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type PreorderInput = z.infer<typeof preorderSchema>;

export const formToApiData = (data: any) => {
  return {
    name: data.name,
    products: Number(data.products),
    preorderWhen: data.preorderWhen,
    startsAt: new Date(data.startsAt).toISOString(),
    endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : null,
    status: data.status,
  };
};

export const apiToFormData = (data: any) => {
  return {
    name: data.name,
    products: data.products,
    preorderWhen: data.preorderWhen,
    startsAt: data.startsAt
      ? new Date(data.startsAt).toISOString().slice(0, 16)
      : "",
    endsAt: data.endsAt ? new Date(data.endsAt).toISOString().slice(0, 16) : "",
    status: data.status,
  };
};
