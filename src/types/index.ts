export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  colors: string[];
  image: string;
  category: 'standard' | 'asiafit';
}

export interface LensOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Prescription {
  rightSphere: string;
  rightCylinder: string;
  rightAxis: string;
  leftSphere: string;
  leftCylinder: string;
  leftAxis: string;
  pd: string;
  add?: string;
}

export interface CartItem {
  product: Product;
  color: string;
  lens: LensOption;
  prescription: Prescription;
  quantity: number;
}
