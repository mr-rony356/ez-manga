import { z } from "zod";

export type WeekDays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type ReleaseSchedule = Record<WeekDays, boolean>;

export interface AdminSeries {
  id: number;
  title: string;
  description: string;
  author: string;
  studio: string;
  release_year: string;
  alternative_names: string;
  adult: boolean;
  series_type: "Comic" | "Novel";
  series_slug: string;
  thumbnail: string;
  background: string;
  total_views: number;
  status: string;
  created_at: string;
  badge: string;
  banner: string | undefined;
  day_views: number;
  protagonist: string | undefined;
  meta?: {
    who_bookmarked_count: number;
  };
  week_views: number;
  month_views: number;
  updated_at: string;
  visibility: "Public" | "Private";
  latest: string;
  seasons: Season[];
  chapters: Chapter[];
  tags: Tag[];
  groups: Group[];
}

export interface PaymentLog {
  id: number;
  custom_id: string;
  paypal_id: string;
  description: string;
  payer_email: string;
  payment_source: string;
  paid: boolean;
  gross: number;
  fee: number;
  net: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  adult: boolean;
  alternative_names: string;
  discord_role_id: string;
  is_main: boolean;
  is_pinned: boolean;
  is_editor_pick: boolean;
  protagonist: string;
  author: string;
  is_coming_soon: boolean;
  background: string;
  chapters: Chapter[];
  paid_chapters: Chapter[];
  free_chapters: Chapter[];
  latest_chapter: Chapter;
  banner: string;
  description: string;
  id: string;
  meta: {
    who_bookmarked_count: string;
    chapters_count: string;
  };
  badge: string;
  release_year: string;
  seasons: Season[];
  series_slug: string;
  series_type: "Comic" | "Novel";
  studio: string;
  tags: Tag[];
  thumbnail: string;
  title: string;
  total_views: number;
  total_used_coins: number;
  total_bought_chapters: number;
  month_used_coins: number;
  month_bought_chapters: number;
  week_used_coins: number;
  week_bought_chapters: number;
  day_used_coins: number;
  day_bought_chapters: number;
  year_used_coins: number;
  year_bought_chapters: number;
  year_views: number;
  month_views: number;
  week_views: number;
  day_views: number;
  daily_metrics: {
    views: number;
    coins: number;
    bought_chapters: number;
  }[];
  weekly_metrics: {
    views: number;
    coins: number;
    bought_chapters: number;
  }[];
  monthly_metrics: {
    views: number;
    coins: number;
    bought_chapters: number;
  }[];
  created_at: string;
  updated_at: string;
  rating: number;
  visibility: string;
  incomes: {
    id: number;
    series_id: number;
    chapter_id: number;
    amount: number;
  }[];
  status: "Completed" | "Hiatus" | "Dropped" | "Ongoing";
  release_schedule: ReleaseSchedule | null;
  nu_link: string | null;
}

export interface Chapter {
  chapter_name: string;
  chapter_slug: string;
  chapter_thumbnail: string;
  chapter_title: string | null;
  created_at: string;
  id: number;
  index: string;
  price: number;
  series_id: string;
  updated_at: string;
  views: number;
  storage: "s3" | "local";
  season_id: string;
  chapter_type: "Novel" | "Comic";
  chapter_content: string;
  series: Series;
  chapter_data: {
    images: string[];
  };
  meta: {
    who_bought_count: string;
  };
}

export interface Season {
  chapters: Chapter[];
  created_at: SVGStringList;
  id: string;
  index: number;
  season_name: string;
  series_id: string;
  updated_at: string;
}

export type Subscription = {
  id: number;
  plan_id: number;
  paypal_subscription_id: string;
  stripe_subscription_id: string;
  subscription_source: string;
  custom_id: string;
  status: string;
  start_time: string;
  next_charge: string;
  user: User;
  last_payment_date: string;
  value: number;
  plan: SubscriptionPlan;
};

export interface User {
  id: string;
  username: string;
  is_staff_reader: boolean;
  email: string;
  role: "Admin" | "Editor" | "Reader";
  coins: number;
  profile_picture: string;
  created_at: string;
  subscriptions: Subscription[];
  bought_chapters: { id: number }[];
  audio_chapters: {
    chapter_name: string;
    url: string | null;
    chapter_title: string;
    id: number;
    series: Series;
  }[];
  editable_series: {
    id: number;
    title: string;
  }[];
  purchases: Purchase[];
  is_ads_free: boolean;
  discord_account?: {
    created_at: string;
    discord_id: number;
    id: number;
    user_id: number;
    discord_nickname: string;
  };
}

export interface EditableSeries {
  id: number;
  title: string;
}

export interface Tag {
  id: number;
  name: string;
  description: string;
  color: string;
  meta: {
    series_count: string;
  };
}

export interface Group {
  id: string;
  name: string;
}

export type Token = {
  expires_at: string;
  token: string;
  type: "Bearer";
};

export type ValidationError = {
  message: string;
};

const chapterAPI = z.object({
  chapter_type: z.enum(["Comic", "Novel"]),
  created_at: z.string(),
  series: z.custom<Series>(),
  chapter: z.custom<Chapter>(),
  data: z.custom<string | string[]>(),
  paywall: z.boolean(),
  next_chapter: z.custom<Chapter | null>(),
  previous_chapter: z.custom<Chapter | null>(),
});

export type ChapterAPIResponse = z.infer<typeof chapterAPI>;
const userSchema = z.object({
  isLoggedIn: z.boolean(),
  user: z.custom<User>(),
});

export type UserDataResponse = z.infer<typeof userSchema>;

export interface Purchase {
  id: number;
  custom_id: string;
  paypal_id: string;
  description: string;
  payment_gateway: string;
  paid: boolean;
  amount: number;
  created_at: string;
}

export type Vote = {
  user_id: number;
  rating_id: number;
};

export type Rating = {
  id: number;
  grade: number;
  review: string;
  user_id: number;
  user: User;
  created_at: string;
  updated_at: string;
  upvotes: Vote[];
  downvotes: Vote[];
  meta: {
    upvotes_count: number;
    downvotes_count: number;
  };
};

export enum CurrencyCodes {
  BRL = "BRL",
  USD = "USD",
  EUR = "EUR",
  JPY = "JPY",
  GBP = "GBP",
}

export type Product = {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Draft" | "Archived";
  paypal_product_id: string;
  type: "PHYSICAL" | "DIGITAL" | "SERVICE";
  price: number;
  currency_code: CurrencyCodes;
  is_subscription_product: boolean;
  created_at: string;
  updated_at: string;
};

export interface ProductsQueryResponse extends QueryResponse<Product> { }

export type QueryResponse<T> = {
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
    current_page: number;
  };
  data: T[];
};

export type SubscriptionPlan = {
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "CREATED";
  interval_unit: "DAY" | "WEEK" | "MONTH" | "YEAR";
  value: number;
  paypal_subscription_plan_id: string;
  series_id: number;
  stripe_subscription_plan_id: string;
  product_id: number;
  subscriptions: Subscription[];
  created_at: string;
  updated_at: string;
  currency_code: string;
  series: Series[];
};

export type SubscriptionPlansQueryResponse = QueryResponse<SubscriptionPlan>;
