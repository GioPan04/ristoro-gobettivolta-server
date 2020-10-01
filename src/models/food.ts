import mongoose from 'mongoose';

export interface IFood extends mongoose.Document {
    name: string; 
    price?: number;
    avaibleCount?: number;
};
  
export const FoodSchema = new mongoose.Schema({
  name: {type:String, required: true},
  price: {type:Number, required: true},
  avaibleCount: {type: Number, default: 100}
});

const Food = mongoose.model<IFood>('Food', FoodSchema);
export default Food;