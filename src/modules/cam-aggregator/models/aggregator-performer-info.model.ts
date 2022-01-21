import { Document } from 'mongoose';

export class AggregatorPerformerInfoModel extends Document {
  service: string;

  servicePerformerId: string;

  gender: string;

  avatar: string;

  username: string;

  dateOfBirth: Date;

  age: number;

  isOnline: boolean;

  watching: number;

  stats: {
    views: number;
    favorites: number;
  };

  isStreaming: boolean;

  streamingStatus: string;

  country: string;

  countryFlag: string;

  city: string;

  languages: string[];

  aboutMe: string;

  tags: string;

  iframe: string;

  profileLink: String

  createdAt: Date;

  updatedAt: Date;
}
