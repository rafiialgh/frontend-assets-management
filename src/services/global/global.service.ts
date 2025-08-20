import { privateInstance } from "@/lib/axios";
import type { BaseResponse } from "@/types/response";
import type { Dropdown } from "./global.type";

export const getDropdown = (): Promise<BaseResponse<Dropdown>> =>
  privateInstance.get('/aset/get').then((res) => res.data);