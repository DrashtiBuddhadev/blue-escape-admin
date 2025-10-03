export interface TravelDates {
  startDate: string;
  endDate: string;
}

export interface BudgetRange {
  min: number;
  max: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  destination: string;
  travel_dates: TravelDates;
  travelers: string;
  budget_range: BudgetRange;
  special_requests: string;
  inquiry_type: string;
  newsletter: boolean;
  created_at: string;
  updated_at: string;
}
