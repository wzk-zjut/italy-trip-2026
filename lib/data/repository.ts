import type {
  TripDay,
  Hotel,
  Booking,
  PrivateNote,
  EntityType,
} from "@/types";

// 写入用的输入类型：id 可选（新建时不传），时间戳由仓库负责。
export type TripDayInput = Omit<TripDay, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type HotelInput = Omit<Hotel, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type BookingInput = Omit<Booking, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type PrivateNoteInput = Omit<
  PrivateNote,
  "id" | "created_at" | "updated_at"
> & { id?: string };

// 统一的数据访问接口。JSON 实现（Phase 1）与 Supabase 实现（Phase 2）都遵守它，
// 业务代码只依赖这个接口，切换后端无需改动页面。
export interface TripRepository {
  // ---- 公开读取（绝不涉及 private_notes）----
  getTripDays(): Promise<TripDay[]>;
  getTripDay(date: string): Promise<TripDay | null>;
  getHotels(): Promise<Hotel[]>;
  getHotel(id: string): Promise<Hotel | null>;
  getBookings(): Promise<Booking[]>;

  // ---- 后台写入 ----
  saveTripDay(input: TripDayInput): Promise<TripDay>;
  deleteTripDay(id: string): Promise<void>;
  saveHotel(input: HotelInput): Promise<Hotel>;
  deleteHotel(id: string): Promise<void>;
  saveBooking(input: BookingInput): Promise<Booking>;
  deleteBooking(id: string): Promise<void>;

  // ---- 私密备注（仅后台）----
  getPrivateNotes(
    entityType?: EntityType,
    entityId?: string,
  ): Promise<PrivateNote[]>;
  savePrivateNote(input: PrivateNoteInput): Promise<PrivateNote>;
  deletePrivateNote(id: string): Promise<void>;
}
