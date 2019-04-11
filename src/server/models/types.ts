export interface EventItem {
  EventItemId: string;
  StartDate: Date;
  EndDate?: Date;
  Title: string;
  Summary: string;
  Body: string;
  Address: string;
  Latitude?: number;
  Longitude?: number;
  Remarks?: string;
}

export interface EventRegistration {
  EventRegistrationId: string;
  EventItemId: string;
  EmailAddress: string;
  PhoneNumber: string;
  Remarks?: string;
}
