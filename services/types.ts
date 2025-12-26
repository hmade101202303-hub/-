
export enum MedicineType {
  TABLET = 'برشام',
  SYRUP = 'شراب',
  INJECTION = 'حقنة',
  SUPPOSITORY = 'لبوس',
  SUPPLIES = 'مستلزمات'
}

export interface Medicine {
  id: string;
  name: string;
  type: MedicineType;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface AdImage {
  id: string;
  url?: string;
  text?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
