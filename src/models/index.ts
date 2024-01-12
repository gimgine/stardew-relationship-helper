export interface Villager {
  name: string;
  imgURL: string;
  iconURL: string;
  wikiURL: string;
  friendshipPoints: number;
  isMarried: boolean;
  birthday: StardewDate;
  loves: Item[];
  isTracking: boolean;
}

export interface Item {
  name: string;
  wikiURL: string;
  imgURL: string;
  quantity: number;
  loveCount: number; // keeps track of how many currently tracked villagers love this item, used in removal
}

export interface StardewDate {
  season: Season;
  day: number;
}

export enum Season {
  SPRING = 'Spring',
  SUMMER = 'Summer',
  FALL = 'Fall',
  WINTER = 'Winter'
}

export enum Quality {
  NORMAL = 1,
  SILVER = 1.1,
  GOLD = 1.25,
  IRIDIUM = 1.5
}

export enum HomeViewOption {
  TRACKER = 'tracker',
  VILLAGERS = 'villagers',
  INVENTORY = 'inventory'
}