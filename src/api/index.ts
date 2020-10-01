import {Router, json} from 'express';
import mongoose from 'mongoose';
import Food from '../models/food';
import Class from '../models/class';
const router = Router();

mongoose.connect('mongodb://127.0.0.1/ristoro', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected to db'));

router.use(json());
router.use(function(error, req, res, next) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
});

router.get('/', (req, res) => {
    res.json({no: 'si'});
});

router.get('/menu', async (req, res) => {
    let data;
    if(req.query.q) {
        data = await Food.find({avaibleCount: {$gt: 0}, name: {$regex: `${req.query.q}`, $options: 'i'}});
    } else {
        data = await Food.find({avaibleCount: {$gt: 0}});
    }
    let menu = Array.from(data.map((e) => {
        return {
            id: e._id,
            name: e.name,
            price: e.price,
            avaibleCount: e.avaibleCount
        };
    }));
    res.json({menu});
});

router.post('/menu', async (req, res) => {
    if(!req.body.name || !req.body.price) {
        res.status(400).json({error: "Bed request"});
        return;
    }
    await (new Food({name: req.body.name, price: req.body.price}).save());
    res.status(201).json({
        ok: true
    });
});

router.post('/class', async (req, res) => {
    if(!req.body.name) {
        res.status(400).json({error: "Bed request"});
        return;
    }
    await (new Class({name: req.body.name}).save());
    res.status(201).json({
        ok: true
    });
});

router.post('/order', async (req, res) => {
    if(!req.body.ids || req.body.ids == [] || !req.body.class) {
        res.status(400).json({error: "Bed request"});
        return;
    }
    let orderedClass = await Class.findById(req.body.class);
    if(!orderedClass) {
        res.status(404).json({error: "La classe non è stata trovata"});
        return;
    }
    let ids = req.body.ids;
    console.log(ids);
    var foods = new Array();
    let ammount = 0;
    for(var id of ids) {
        let food = await Food.findById(id);
        if(!food) break;
        if(food.avaibleCount <= 0) break;
        food.avaibleCount--;
        await food.save();
        orderedClass.orders.push(food);
        foods.push(food);
        ammount += food.price;
    }
    orderedClass.save();
    res.status(201).json({foods, ammount});
});

router.get('/class', async (req, res) => {
    let classs = await Class.find();
    let classObj = Array.from(classs.map((e) => {
        return {
            id: e._id,
            name: e.name,
        };
    }));
    res.json({classObj});
});

router.get('/class/:id', async (req, res) => {
    if(!req.params.id) {
        res.status(400).json({error: 'Bed request'});
        return;
    }
    let classs = await Class.findById(req.params.id).populate('orders');
    if(!classs) {
        res.status(404).json({error: "Classe non trovata"});
        return;
    }
    let orders = classs.orders;
    let ammount = 0;
    for(var order of orders) {
        ammount+=order.price;
    }
    res.json({
        orders,
        ammount,
    });
});


export default router;