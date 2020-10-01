import mongoose from 'mongoose';

export interface IFood extends mongoose.Document {
    name: string; 
    price?: number; 
};
  
export const FoodSchema = new mongoose.Schema({
  name: {type:String, required: true},
  price: {type:Number, required: true},
});

const Food = mongoose.model<IFood>('User', FoodSchema);
export default Food;