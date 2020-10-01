import mongoose, { Schema } from 'mongoose';

export interface IClass extends mongoose.Document {
    name: string; 
    orders: any;
};
  
export const ClassSchema = new mongoose.Schema({
  name: {type:String, required: true},
  orders: [{type:Schema.Types.ObjectId, ref: 'Food'}],
});

const Class = mongoose.model<IClass>('Class', ClassSchema);
export default Class;